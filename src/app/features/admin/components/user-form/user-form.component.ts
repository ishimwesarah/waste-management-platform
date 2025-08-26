import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ApiService } from '../../../../core/services/api.service';
import { User } from '../../../../core/interfaces/user.interface';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <app-page-header [title]="isEditing() ? 'Edit User' : 'Add New User'"
                     [subtitle]="isEditing() ? 'Update user details' : 'Create a new user account'"></app-page-header>

    <div class="user-form-container card">
      @if (isLoadingForm()) {
        <app-loading-spinner></app-loading-spinner>
      } @else {
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
          <div class="form-group">
            <label for="firstName" class="form-label">First Name:</label>
            <input type="text" id="firstName" formControlName="firstName" class="form-input"
                   [class.is-invalid]="userForm.get('firstName')?.invalid && (userForm.get('firstName')?.dirty || userForm.get('firstName')?.touched)" />
            @if (userForm.get('firstName')?.invalid && (userForm.get('firstName')?.dirty || userForm.get('firstName')?.touched)) {
              <p class="error-message">First name is required.</p>
            }
          </div>

          <div class="form-group">
            <label for="lastName" class="form-label">Last Name:</label>
            <input type="text" id="lastName" formControlName="lastName" class="form-input"
                   [class.is-invalid]="userForm.get('lastName')?.invalid && (userForm.get('lastName')?.dirty || userForm.get('lastName')?.touched)" />
            @if (userForm.get('lastName')?.invalid && (userForm.get('lastName')?.dirty || userForm.get('lastName')?.touched)) {
              <p class="error-message">Last name is required.</p>
            }
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email:</label>
            <input type="email" id="email" formControlName="email" class="form-input"
                   [class.is-invalid]="userForm.get('email')?.invalid && (userForm.get('email')?.dirty || userForm.get('email')?.touched)" />
            @if (userForm.get('email')?.invalid && (userForm.get('email')?.dirty || userForm.get('email')?.touched)) {
              <p class="error-message">Valid email is required.</p>
            }
          </div>

          <div class="form-group">
            <label for="role" class="form-label">Role:</label>
            <select id="role" formControlName="role" class="form-select"
                    [class.is-invalid]="userForm.get('role')?.invalid && (userForm.get('role')?.dirty || userForm.get('role')?.touched)">
              <option value="resident">Resident</option>
              <option value="collector">Collector</option>
              <option value="admin">Admin</option>
            </select>
            @if (userForm.get('role')?.invalid && (userForm.get('role')?.dirty || userForm.get('role')?.touched)) {
              <p class="error-message">Role is required.</p>
            }
          </div>

          @if (!isEditing()) {
            <div class="form-group">
              <label for="password" class="form-label">Password:</label>
              <input type="password" id="password" formControlName="password" class="form-input"
                     [class.is-invalid]="userForm.get('password')?.invalid && (userForm.get('password')?.dirty || userForm.get('password')?.touched)" />
              @if (userForm.get('password')?.invalid && (userForm.get('password')?.dirty || userForm.get('password')?.touched)) {
                <p class="error-message">Password is required (min 6 characters).</p>
              }
            </div>
          }

          @if (errorMessage()) {
            <p class="alert-error">{{ errorMessage() }}</p>
          }

          <div class="form-actions flex-end gap-md">
            <button type="submit" [disabled]="userForm.invalid || isSubmitting()" class="btn btn-primary">
              @if (isSubmitting()) {
                <app-loading-spinner size="small"></app-loading-spinner> Saving...
              } @else {
                {{ isEditing() ? 'Update User' : 'Add User' }}
              }
            </button>
            <a routerLink="/admin/users" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      }
    </div>
  `,
  styles: `
    .user-form-container {
      /* .card provides base styling */
      max-width: 700px;
      margin: var(--space-xl) auto;
    }
    .user-form {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }
    @media (min-width: 768px) {
      .user-form {
        grid-template-columns: 1fr 1fr;
      }
      .form-group:nth-child(3), .form-group:nth-child(4), .form-group:nth-child(5) { /* email, role, password */
        grid-column: span 2;
      }
    }
    /* form-group, form-label, form-input, form-select, error-message, alert-error are globally styled */
    .form-actions {
      grid-column: span 2;
      margin-top: var(--space-xl);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public userId: string | null = null;
  public isEditing = signal(false);
  public isLoadingForm = signal(true);
  public isSubmitting = signal(false);
  public errorMessage = signal<string | null>(null);

  public userForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['resident' as User['role'], [Validators.required]],
    password: ['', [Validators.minLength(6)]]
  });

  constructor() {
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      this.userId = params.get('id');
      this.isEditing.set(!!this.userId);
      if (this.userId) {
        this.loadUser(this.userId);
      } else {
        this.isLoadingForm.set(false);
        this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.userForm.get('password')?.updateValueAndValidity();
      }
    });
  }

  loadUser(id: string): void {
    this.isLoadingForm.set(true);
    this.api.get<User>(`/users/${id}`).pipe(take(1)).subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
        this.isLoadingForm.set(false);
      },
      error: (err: HttpErrorResponse) => { // Type err explicitly
        console.error('Failed to load user', err);
        this.errorMessage.set('Failed to load user details.');
        this.isLoadingForm.set(false);
      }
    });
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.errorMessage.set('Please correct the form errors.');
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.userForm.getRawValue();

    if (this.isEditing() && this.userId) {
      const updatePayload = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        role: formValue.role,
      };

      this.api.put<User>(`/users/${this.userId}`, updatePayload).pipe(take(1)).subscribe({
        next: () => {
          this.router.navigate(['/admin/users']);
        },
        error: (err: HttpErrorResponse) => { // Type err explicitly
          console.error('Update failed', err);
          this.errorMessage.set('Failed to update user.');
          this.isSubmitting.set(false);
        }
      });
    } else {
      const createPayload = {
        ...formValue,
        passwordHash: formValue.password
      };
      this.api.post<User>('/users', createPayload).pipe(take(1)).subscribe({
        next: () => {
          this.router.navigate(['/admin/users']);
        },
        error: (err: HttpErrorResponse) => { // Type err explicitly
          console.error('Creation failed', err);
          this.errorMessage.set('Failed to add new user.');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}