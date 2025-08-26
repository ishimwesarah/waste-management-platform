import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,    // <-- Import FormGroup
  FormControl   // <-- Import FormControl
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // RouterLink added back for the 'Back to Schedule Viewer' button
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ApiService } from '../../../../core/services/api.service';
import { ScheduleEntry } from '../../../../core/interfaces/schedule.interface';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

// Define the precise type for the *controls* within our form group
interface ScheduleEditFormControls {
  status: FormControl<'scheduled' | 'collected' | 'rescheduled' | 'cancelled'>;
}

@Component({
  selector: 'app-schedule-editor',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    RouterLink // Added back for the 'Back to Schedule Viewer' button
  ],
  template: `
    <app-page-header title="Manage Collection Schedule" subtitle="Update collection status or modify entries"></app-page-header>

    <div class="schedule-editor-container card">
      @if (isLoadingSchedule()) {
        <app-loading-spinner></app-loading-spinner>
      } @else if (scheduleEntries().length === 0) {
        <p class="text-center">No schedule entries to manage.</p>
        <div class="flex-center mt-lg">
          <a routerLink="/schedule" class="btn btn-secondary">Back to Schedule Viewer</a>
        </div>
      } @else {
        <div class="schedule-edit-list">
          @for (entry of scheduleEntries(); track entry.id) {
            @let form = getFormForEntry(entry.id);
            <div class="schedule-edit-card card">
              <h3>{{ entry.area }} - {{ entry.collectionDate }}</h3>
              <form [formGroup]="form" (ngSubmit)="updateStatus(entry.id)" class="status-form">
                <div class="form-group">
                  <label for="status-{{entry.id}}">Status:</label>
                  <select id="status-{{entry.id}}" [formControl]="form.controls.status" class="form-select">
                    <option value="scheduled">Scheduled</option>
                    <option value="collected">Collected</option>
                    <option value="rescheduled">Rescheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button type="submit" [disabled]="form.pristine || isSubmitting()" class="btn btn-sm btn-primary">
                  @if (isSubmitting()) {
                    <app-loading-spinner size="small"></app-loading-spinner> Saving...
                  } @else {
                    Update
                  }
                </button>
              </form>
            </div>
          }
        </div>
      }
      @if (errorMessage()) {
        <p class="alert-error">{{ errorMessage() }}</p>
      }
      @if (!isLoadingSchedule() && scheduleEntries().length > 0) {
        <div class="flex-end mt-xl">
          <a routerLink="/schedule" class="btn btn-secondary">Back to Schedule Viewer</a>
        </div>
      }
    </div>
  `,
  styles: `
    .schedule-editor-container {
      /* .card provides base styling */
    }
    .schedule-edit-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-lg);
      margin-top: var(--space-md);
    }
    .schedule-edit-card {
      /* .card provides base styling */
      padding: var(--space-xl);
      box-shadow: var(--shadow-sm);
    }
    .schedule-edit-card h3 {
      color: var(--color-primary-dark);
      margin-top: 0;
      margin-bottom: var(--space-md);
      font-size: 1.25rem;
    }
    .status-form {
      display: flex;
      gap: var(--space-md);
      align-items: flex-end;
      margin-top: var(--space-md);
    }
    .form-group {
      flex-grow: 1;
      margin-bottom: 0; /* Override default form-group margin for inline form */
    }
    /* form-label, form-select, btn-primary, alert-error are globally styled */
    .flex-center {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .flex-end {
      display: flex;
      justify-content: flex-end;
    }
    .mt-xl {
      margin-top: var(--space-xl);
    }
    .mt-lg {
      margin-top: var(--space-lg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleEditorComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  public scheduleEntries = signal<ScheduleEntry[]>([]);
  public isLoadingSchedule = signal(true);
  public isSubmitting = signal(false);
  public errorMessage = signal<string | null>(null);

  private entryForms = new Map<string, FormGroup<ScheduleEditFormControls>>();

  constructor() {
    this.loadSchedule();
  }

  loadSchedule(): void {
    this.isLoadingSchedule.set(true);
    this.api.get<ScheduleEntry[]>('/schedule').pipe(take(1)).subscribe({
      next: (data) => {
        this.scheduleEntries.set(data);
        this.initializeForms(data);
        this.isLoadingSchedule.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load schedule for editing', err);
        this.errorMessage.set('Failed to load schedule. Please try again.');
        this.isLoadingSchedule.set(false);
      }
    });
  }

  initializeForms(entries: ScheduleEntry[]): void {
    this.entryForms.clear();
    entries.forEach(entry => {
      const form = this.fb.nonNullable.group<ScheduleEditFormControls>({
        status: this.fb.nonNullable.control(entry.status, [Validators.required]),
      });
      this.entryForms.set(entry.id, form);
    });
  }

  getFormForEntry(id: string): FormGroup<ScheduleEditFormControls> {
    const form = this.entryForms.get(id);
    if (!form) {
      return this.fb.nonNullable.group<ScheduleEditFormControls>({
        status: this.fb.nonNullable.control('scheduled', [Validators.required])
      });
    }
    return form;
  }

  updateStatus(id: string): void {
    const form = this.getFormForEntry(id);
    this.errorMessage.set(null);

    if (form.invalid || form.pristine) {
      form.markAllAsTouched();
      if(form.pristine) this.errorMessage.set('No changes detected to update.');
      else this.errorMessage.set('Please correct form errors.');
      return;
    }

    this.isSubmitting.set(true);
    const updatedStatus = form.controls.status.value;

    this.api.put<ScheduleEntry>(`/schedule/${id}`, { status: updatedStatus }).pipe(take(1)).subscribe({
      next: () => {
        this.scheduleEntries.update(currentEntries =>
          currentEntries.map(entry => entry.id === id ? { ...entry, status: updatedStatus } : entry)
        );
        form.markAsPristine();
        this.isSubmitting.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to update schedule status', err);
        this.errorMessage.set('Failed to update schedule status. Please try again.');
        this.isSubmitting.set(false);
      }
    });
  }
}