import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ApiService } from '../../../../core/services/api.service';
import { ScheduleEntry } from '../../../../core/interfaces/schedule.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-schedule-viewer',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, RouterLink],
  template: `
    <app-page-header title="Garbage Collection Schedule" subtitle="View upcoming collection dates for your area"></app-page-header>

    <div class="schedule-container card">
      @if (authService.currentUser()?.role === 'collector' || authService.currentUser()?.role === 'admin') {
        <div class="actions flex-end mb-lg">
          <a routerLink="/schedule/edit" class="btn btn-primary">Manage Schedule</a>
        </div>
      }
      @if (isLoading()) {
        <p class="text-center">Loading schedule...</p>
      } @else if (scheduleEntries().length === 0) {
        <p class="text-center">No collection schedule available for your area at this time.</p>
      } @else {
        <div class="schedule-list">
          @for (entry of scheduleEntries(); track entry.id) {
            <div class="schedule-card card">
              <h3>{{ entry.area }}</h3>
              <p><strong>Date:</strong> {{ entry.collectionDate }}</p>
              <p><strong>Time:</strong> {{ entry.collectionTime }}</p>
              <p><strong>Status:</strong> <span class="status-badge status-{{entry.status}}">{{ entry.status | titlecase }}</span></p>
              @if (entry.collectorId) {
                <p><strong>Collector ID:</strong> {{ entry.collectorId }}</p>
              }
            </div>
          }
        </div>
      }
      @if (errorMessage()) {
        <p class="alert-error">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styles: `
    .schedule-container {
      /* .card provides base styling */
    }
    .actions {
      /* flex-end and mb-lg are utility classes */
    }
    .schedule-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-lg);
      margin-top: var(--space-md);
    }
    .schedule-card {
      /* .card provides base styling, but override padding */
      padding: var(--space-xl);
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    .schedule-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
    }
    .schedule-card h3 {
      color: var(--color-primary-dark);
      margin-top: 0;
      margin-bottom: var(--space-md);
      font-size: 1.25rem;
    }
    .schedule-card p {
      margin-bottom: var(--space-sm);
      font-size: 0.95rem;
      color: var(--color-text-medium);
    }
    .schedule-card strong {
      color: var(--color-text-dark);
    }
    /* .status-badge and specific status styles are global */
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleViewerComponent {
  private api = inject(ApiService);
  public authService = inject(AuthService);
  public scheduleEntries = signal<ScheduleEntry[]>([]);
  public isLoading = signal(true);
  public errorMessage = signal<string | null>(null);

  constructor() {
    this.loadSchedule();
  }

  loadSchedule(): void {
    this.isLoading.set(true);
    this.api.get<ScheduleEntry[]>('/schedule').subscribe({
      next: (data) => {
        this.scheduleEntries.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => { // Type err explicitly
        console.error('Failed to load schedule', err);
        this.errorMessage.set('Failed to load schedule. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}