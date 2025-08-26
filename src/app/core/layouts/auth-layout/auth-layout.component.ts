import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NgOptimizedImage],
  template: `
    <div class="auth-layout-container">
      <header class="app-header">
        <div class="header-content container">
          <a routerLink="/dashboard" class="logo-link">
            <img ngSrc="assets/images/logo.png" alt="WasteWise Connect Logo" width="40" height="40" priority>
            <h2>WasteWise Connect</h2>
          </a>
          <nav class="main-nav" aria-label="Authenticated Navigation">
            <ul>
              <li><a routerLink="/dashboard" routerLinkActive="active-link" aria-label="Go to Dashboard">Dashboard</a></li>
              <li><a routerLink="/schedule" routerLinkActive="active-link" aria-label="View Garbage Collection Schedule">Schedule</a></li>
              <li><a routerLink="/invoices" routerLinkActive="active-link" aria-label="Manage Invoices and Payments">Invoices</a></li>
              @if (authService.currentUser()?.role === 'admin') {
                <li><a routerLink="/admin/users" routerLinkActive="active-link" aria-label="Manage Users">Admin</a></li>
              }
              @if (authService.currentUser()?.role === 'collector') {
                 <li><a routerLink="/schedule/edit" routerLinkActive="active-link" aria-label="Update Collection Status">Collector</a></li>
              }
            </ul>
          </nav>
          <div class="header-actions">
            <button (click)="logout()" class="btn btn-secondary">Logout</button>
          </div>
        </div>
      </header>

      <main class="app-main container">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
        <div class="container">
          <p>&copy; {{ currentYear }} WasteWise Connect. All rights reserved.</p>
          <nav class="footer-nav" aria-label="Footer Navigation">
            <ul>
              <li><a routerLink="/privacy">Privacy Policy</a></li>
              <li><a routerLink="/terms">Terms of Service</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: var(--color-background-light);
    }
    .auth-layout-container {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--space-md);
      width: 100%;
    }
    .app-header {
      background-color: var(--color-surface);
      box-shadow: var(--shadow-md);
      padding: var(--space-md) 0;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: var(--color-text-dark);
      gap: var(--space-sm);
    }
    .logo-link img {
      width: 32px;
      height: 32px;
      border-radius: 4px;
    }
    .logo-link h2 {
      font-size: 1.5rem;
      margin: 0;
      font-weight: 700;
      color: var(--color-primary-dark);
    }
    .main-nav ul {
      display: flex;
      gap: var(--space-xl);
    }
    .main-nav a {
      color: var(--color-text-medium);
      font-weight: 500;
      padding: var(--space-sm) 0;
      position: relative;
    }
    .main-nav a.active-link {
      color: var(--color-primary);
      font-weight: 600;
    }
    .main-nav a.active-link::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--color-primary);
    }
    .header-actions .btn {
      padding: var(--space-sm) var(--space-lg);
    }

    .app-main {
      flex-grow: 1;
      padding-top: var(--space-xl);
      padding-bottom: var(--space-xl);
    }

    .app-footer {
      background-color: var(--color-text-dark);
      color: var(--color-border);
      padding: var(--space-xl) 0;
      font-size: 0.9rem;
      text-align: center;
      margin-top: auto;
    }
    .app-footer .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-md);
    }
    .footer-nav ul {
      display: flex;
      gap: var(--space-xl);
    }
    .footer-nav a {
      color: var(--color-border);
      font-weight: 400;
    }
    .footer-nav a:hover {
      color: var(--color-primary-light);
    }

    /* Responsive Adjustments */
    @media (max-width: 768px) {
      .header-content {
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-md);
      }
      .main-nav ul {
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-md);
      }
      .header-actions {
        width: 100%;
        text-align: center;
      }
      .app-footer .container {
        text-align: center;
      }
      .footer-nav ul {
        flex-direction: column;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayoutComponent {
  public authService = inject(AuthService);
  private router = inject(Router);
  public currentYear = new Date().getFullYear();

  logout(): void {
    this.authService.logout();
  }
}