import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ApiService } from '../../../../core/services/api.service';
import { User } from '../../../../core/interfaces/user.interface';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, RouterLink],
  template: `
    <app-page-header title="User Management" subtitle="View and manage system users"></app-page-header>
    <div class="user-list-container card">
      <div class="actions flex-end mb-lg">
        <a routerLink="/admin/users/new" class="btn btn-primary">Add New User</a>
      </div>
      @if (isLoading()) {
        <p class="text-center">Loading users...</p>
      } @else if (users().length === 0) {
        <p class="text-center">No users found.</p>
      } @else {
        <div class="table-responsive">
          <table class="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr>
                  <td>{{ user.firstName }} {{ user.lastName }}</td>
                  <td>{{ user.email }}</td>
                  <td><span class="status-badge">{{ user.role | titlecase }}</span></td>
                  <td class="table-actions">
                    <a [routerLink]="['/admin/users/edit', user.id]" class="btn btn-secondary btn-sm">Edit</a>
                    <button (click)="deleteUser(user.id)" class="btn btn-danger btn-sm ml-sm">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
      @if (errorMessage()) {
        <p class="alert-error">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styles: `
    .user-list-container {
      /* .card provides base styling */
    }
    .table-responsive {
      overflow-x: auto; /* Ensures table is scrollable on small screens */
    }
    .user-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: var(--space-md);
    }
    .user-table th, .user-table td {
      border: 1px solid var(--color-border);
      padding: var(--space-md);
      text-align: left;
    }
    .user-table th {
      background-color: var(--color-background-light);
      font-weight: 600;
      color: var(--color-text-dark);
    }
    .user-table tr:nth-child(even) {
      /* Corrected: Use the pre-defined CSS variable */
      background-color: var(--color-background-even-row);
    }
    .table-actions {
      white-space: nowrap; /* Prevent buttons from wrapping */
    }
    .status-badge {
      background-color: var(--color-accent); /* Generic badge color for roles */
    }
    .ml-sm {
      margin-left: var(--space-sm);
    }
    .mb-lg {
      margin-bottom: var(--space-lg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  private api = inject(ApiService);
  public users = signal<User[]>([]);
  public isLoading = signal(true);
  public errorMessage = signal<string | null>(null);

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.api.get<User[]>('/users').subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load users', err);
        this.errorMessage.set('Failed to load users. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.api.delete(`/users/${id}`).subscribe({
        next: () => {
          this.users.update(currentUsers => currentUsers.filter(user => user.id !== id));
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to delete user', err);
          this.errorMessage.set('Failed to delete user. Please try again.');
        }
      });
    }
  }
}