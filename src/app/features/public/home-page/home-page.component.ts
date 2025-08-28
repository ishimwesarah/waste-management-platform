import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  template: `
    <section class="hero-section">
      <div class="hero-content container">
        <div class="hero-text">
          <h1>Effortless Waste Management, Right at Your Fingertips.</h1>
          <p class="lead">
            WasteWise Connect simplifies garbage collection for residents and collectors.
            Stay informed, manage payments, and ensure a cleaner community.
          </p>
          <div class="hero-actions">
            <a routerLink="/register" class="btn btn-primary btn-lg">Get Started Today</a>
            <a routerLink="/about" class="btn btn-secondary btn-lg ml-md">Learn More</a>
          </div>
        </div>
        <div class="hero-image">
          <img ngSrc="assets/images/hero.jpg" alt="Waste collection truck" width="600" height="400" priority>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container text-center">
        <h2>How WasteWise Connect Helps You</h2>
        <div class="feature-grid">
          <div class="feature-card card">
            <div class="icon-placeholder">🗑️</div>
            <h3>Never Miss a Collection</h3>
            <p>Get real-time schedules and reminders for your neighborhood's garbage collection days.</p>
          </div>
          <div class="feature-card card">
            <div class="icon-placeholder">💳</div>
            <h3>Hassle-Free Invoicing & Payments</h3>
            <p>View digital invoices, track payment history, and pay securely online with reminders.</p>
          </div>
          <div class="feature-card card">
            <div class="icon-placeholder">✨</div>
            <h3>Transparent & Efficient</h3>
            <p>Collectors update service status, ensuring transparency and reducing manual paperwork.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="call-to-action-section">
      <div class="container text-center card">
        <h2>Ready for a Smarter Waste Management?</h2>
        <p>Join WasteWise Connect and experience convenience and clarity.</p>
        <a routerLink="/register" class="btn btn-primary btn-lg">Sign Up Now</a>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .hero-section {
      background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
      color: var(--color-surface);
      padding: var(--space-xxl) 0;
      text-align: center;
    }
    .hero-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-xl);
      text-align: left;
    }
    .hero-text {
      flex: 1;
    }
    .hero-text h1 {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: var(--space-md);
      color: var(--color-surface);
      line-height: 1.2;
    }
    .hero-text .lead {
      font-size: 1.25rem;
      margin-bottom: var(--space-xl);
      color: rgba(255, 255, 255, 0.9);
    }
    .hero-actions {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
    }
    .hero-actions .btn-lg {
      padding: var(--space-md) var(--space-xxl);
      font-size: 1.15rem;
    }
    .hero-actions .btn-secondary {
      background-color: transparent;
      border-color: var(--color-surface);
      color: var(--color-surface);
    }
    .hero-actions .btn-secondary:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--color-surface);
    }
    .hero-image {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .hero-image img {
      max-width: 100%;
      height: auto;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
    }

    .features-section {
      padding: var(--space-xxl) 0;
      background-color: var(--color-surface);
    }
    .features-section h2 {
      margin-bottom: var(--space-xxl);
      color: var(--color-text-dark);
      font-size: 2.5rem;
    }
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-xl);
    }
    .feature-card {
      text-align: center;
      padding: var(--space-xl);
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
    }
    .feature-card .icon-placeholder {
      font-size: 3rem;
      margin-bottom: var(--space-md);
    }
    .feature-card h3 {
      color: var(--color-primary-dark);
      font-size: 1.5rem;
    }

    .call-to-action-section {
      padding: var(--space-xxl) 0;
      background-color: var(--color-background-light);
    }
    .call-to-action-section .card {
      padding: var(--space-xxl);
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    .call-to-action-section h2 {
      color: var(--color-primary-dark);
      margin-bottom: var(--space-md);
    }
    .call-to-action-section p {
      font-size: 1.15rem;
      margin-bottom: var(--space-xl);
      color: var(--color-text-medium);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--space-md);
      width: 100%;
    }
    .ml-md { margin-left: var(--space-md); }

    /* Responsive Adjustments */
    @media (max-width: 992px) {
      .hero-content {
        flex-direction: column;
        text-align: center;
      }
      .hero-actions {
        justify-content: center;
      }
      .hero-image {
        margin-top: var(--space-xl);
      }
      .hero-text h1 {
        font-size: 2.8rem;
      }
    }
    @media (max-width: 576px) {
      .hero-text h1 {
        font-size: 2rem;
      }
      .hero-text .lead {
        font-size: 1rem;
      }
      .hero-actions .btn-lg {
        width: 100%;
        margin-left: 0 !important;
      }
      .feature-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  public authService = inject(AuthService); // Just to demonstrate injection, not directly used in template now.

  // NOTE: You need to create an image 'src/assets/images/hero-waste-truck.png' for NgOptimizedImage
  // For example, a picture of a modern garbage truck or a clean neighborhood.
}