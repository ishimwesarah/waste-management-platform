import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, RouterLink],
  template: `
    <app-page-header title="Welcome to Your Dashboard"></app-page-header>

    <div class="dashboard-grid">
      @if (authService.currentUser()) {
        <section class="user-info-card card">
          <h3>Hello, {{ authService.currentUser()?.firstName }}!</h3>
          <p>Role: <span class="status-badge">{{ authService.currentUser()?.role | titlecase }}</span></p>
          @if (authService.currentUser()?.address) {
            <p>Address: {{ authService.currentUser()?.address }}</p>
          }
          <p>Email: {{ authService.currentUser()?.email }}</p>
        </section>
      }

      <section class="quick-links-card card">
        <h3>Quick Actions</h3>
        <ul class="clean-list">
          <li><a routerLink="/schedule" aria-label="View collection schedule">View Collection Schedule</a></li>
          <li><a routerLink="/invoices" aria-label="Check invoices and payments">Check Invoices & Payments</a></li>
          @if (authService.currentUser()?.role === 'collector') {
            <li><a routerLink="/schedule/edit" aria-label="Update collection status">Update Collection Status</a></li>
          }
          @if (authService.currentUser()?.role === 'admin') {
            <li><a routerLink="/admin/users" aria-label="Manage users">Manage Users</a></li>
          }
        </ul>
      </section>

      <section class="notifications-card card">
        <h3>Latest Notifications</h3>
        <p>Your next collection is scheduled for **Tuesday, October 26th at 8:00 AM**.</p>
        <p>Invoice #INV2023-09-001 is due in 5 days.</p>
        <button class="btn btn-secondary mt-md" aria-label="View all notifications">View All Notifications</button>
      </section>
    </div>
  `,
  styles: `
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-xl);
      margin-top: var(--space-xxl);
    }
    /* .card is globally styled */
    .card h3 {
      color: var(--color-primary-dark);
      margin-top: 0;
      margin-bottom: var(--space-md);
      font-size: 1.4rem;
    }
    .user-info-card p, .notifications-card p {
      margin-bottom: var(--space-sm);
      line-height: 1.6;
      color: var(--color-text-medium);
    }
    .status-badge { /* Globally styled, but specific adjustments can be made here */
      background-color: var(--color-accent); // Override for general role badge
    }
    .clean-list { // Reusing global list reset
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .quick-links-card li {
      margin-bottom: var(--space-sm);
    }
    .quick-links-card a {
      color: var(--color-accent);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }
    .quick-links-card a:hover {
      color: var(--color-accent-dark);
      text-decoration: underline;
    }
    /* .btn and .btn-secondary are globally styled */
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  public authService = inject(AuthService);
}