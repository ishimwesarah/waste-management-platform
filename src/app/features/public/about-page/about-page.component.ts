import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, NgOptimizedImage, RouterLink],
  template: `
    <div class="container">
      <app-page-header title="About WasteWise Connect" subtitle="Our Mission for a Cleaner, Smarter Community"></app-page-header>

      <section class="about-intro card">
        <p>
          WasteWise Connect was born from a simple idea: that managing waste
          shouldn't be a messy process. In many neighborhoods, garbage collection
          is still a manual, often frustrating experience for both residents and collectors.
          We envisioned a solution that brings clarity, convenience, and efficiency to this essential service.
        </p>
        <img ngSrc="assets/images/about.jpg" alt="WasteWise Connect Team" width="800" height="450">
      </section>

      <section class="our-mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to revolutionize neighborhood waste management through technology.
          We empower residents with transparent schedules and easy payment options,
          while providing collectors and administrators with the tools they need
          to work efficiently and effectively. We believe that a well-managed waste system
          contributes directly to healthier, happier communities.
        </p>
      </section>

      <section class="our-values">
        <h2>Our Values</h2>
        <div class="values-grid">
          <div class="value-item">
            <h3>Transparency</h3>
            <p>Clear communication and accessible information for everyone involved.</p>
          </div>
          <div class="value-item">
            <h3>Efficiency</h3>
            <p>Streamlined processes that save time and reduce administrative burden.</p>
          </div>
          <div class="value-item">
            <h3>Community</h3>
            <p>Building stronger, cleaner neighborhoods through shared responsibility.</p>
          </div>
          <div class="value-item">
            <h3>Innovation</h3>
            <p>Continuously seeking better ways to solve everyday challenges.</p>
          </div>
        </div>
      </section>

      <section class="join-us-cta text-center card">
        <h2>Join the WasteWise Movement</h2>
        <p>Experience the difference a smart waste management platform can make.</p>
        <a routerLink="/register" class="btn btn-primary btn-lg">Get Started</a>
      </section>
    </div>
  `,
  styles: `
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: var(--space-md);
    }
    app-page-header {
      margin-bottom: var(--space-xxl);
    }

    .about-intro {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      margin-bottom: var(--space-xxl);
    }
    .about-intro p {
      font-size: 1.15rem;
      line-height: 1.8;
      color: var(--color-text-medium);
    }
    .about-intro img {
      max-width: 100%;
      height: auto;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-md);
    }

    .our-mission, .our-values {
      margin-bottom: var(--space-xxl);
      text-align: center;
    }
    .our-mission h2, .our-values h2 {
      font-size: 2.2rem;
      color: var(--color-primary-dark);
      margin-bottom: var(--space-xl);
    }
    .our-mission p {
      max-width: 800px;
      margin: 0 auto var(--space-lg) auto;
      font-size: 1.1rem;
      color: var(--color-text-medium);
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-xl);
      margin-top: var(--space-xxl);
    }
    .value-item {
      background-color: var(--color-surface);
      padding: var(--space-xl);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    .value-item:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-md);
    }
    .value-item h3 {
      color: var(--color-accent-dark);
      font-size: 1.4rem;
      margin-bottom: var(--space-md);
    }
    .value-item p {
      color: var(--color-text-light);
    }

    .join-us-cta {
      padding: var(--space-xxl);
      text-align: center;
    }
    .join-us-cta h2 {
      color: var(--color-primary-dark);
      margin-bottom: var(--space-md);
    }
    .join-us-cta p {
      font-size: 1.15rem;
      margin-bottom: var(--space-xl);
      color: var(--color-text-medium);
    }
    .btn-lg {
      padding: var(--space-md) var(--space-xxl);
      font-size: 1.15rem;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .about-intro img {
        margin-top: var(--space-md);
      }
      .values-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutPageComponent {
  // NOTE: You need to create an image 'src/assets/images/about-team.png'
  // For example, a picture of a team working, or a conceptual image of collaboration.
}