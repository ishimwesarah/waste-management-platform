import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ApiService } from '../../../core/services/api.service'; // For simulating contact form submission

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ReactiveFormsModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <app-page-header title="Contact Us" subtitle="We're here to help!"></app-page-header>

      <div class="contact-grid">
        <div class="contact-info card">
          <h2>Get in Touch</h2>
          <p>
            Have a question, feedback, or need support? Reach out to our team,
            and we'll get back to you as soon as possible.
          </p>
          <div class="info-item">
            <strong>Email:</strong> <a href="mailto:support@wastewiseconnect.com">support@wastewiseconnect.com</a>
          </div>
          <div class="info-item">
            <strong>Phone:</strong> <a href="tel:+15551234567">+1 (555) 123-4567</a>
          </div>
          <div class="info-item">
            <strong>Address:</strong> 123 Eco-Friendly Lane, Green City, GC 90210
          </div>
          <div class="social-links">
            <a href="#" target="_blank" aria-label="Follow us on Facebook">Facebook</a>
            <a href="#" target="_blank" aria-label="Follow us on Twitter">Twitter</a>
            <a href="#" target="_blank" aria-label="Follow us on LinkedIn">LinkedIn</a>
          </div>
        </div>

        <div class="contact-form-wrapper card">
          <h2>Send Us a Message</h2>
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
            <div class="form-group">
              <label for="name" class="form-label">Your Name:</label>
              <input type="text" id="name" formControlName="name" class="form-input"
                     [class.is-invalid]="contactForm.get('name')?.invalid && (contactForm.get('name')?.dirty || contactForm.get('name')?.touched)" />
              @if (contactForm.get('name')?.invalid && (contactForm.get('name')?.dirty || contactForm.get('name')?.touched)) {
                <p class="error-message">Name is required.</p>
              }
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Your Email:</label>
              <input type="email" id="email" formControlName="email" class="form-input"
                     [class.is-invalid]="contactForm.get('email')?.invalid && (contactForm.get('email')?.dirty || contactForm.get('email')?.touched)" />
              @if (contactForm.get('email')?.invalid && (contactForm.get('email')?.dirty || contactForm.get('email')?.touched)) {
                <p class="error-message">Valid email is required.</p>
              }
            </div>

            <div class="form-group">
              <label for="subject" class="form-label">Subject:</label>
              <input type="text" id="subject" formControlName="subject" class="form-input"
                     [class.is-invalid]="contactForm.get('subject')?.invalid && (contactForm.get('subject')?.dirty || contactForm.get('subject')?.touched)" />
              @if (contactForm.get('subject')?.invalid && (contactForm.get('subject')?.dirty || contactForm.get('subject')?.touched)) {
                <p class="error-message">Subject is required.</p>
              }
            </div>

            <div class="form-group">
              <label for="message" class="form-label">Your Message:</label>
              <textarea id="message" formControlName="message" rows="5" class="form-input"
                        [class.is-invalid]="contactForm.get('message')?.invalid && (contactForm.get('message')?.dirty || contactForm.get('message')?.touched)"></textarea>
              @if (contactForm.get('message')?.invalid && (contactForm.get('message')?.dirty || contactForm.get('message')?.touched)) {
                <p class="error-message">Message is required (min 10 characters).</p>
              }
            </div>

            @if (formMessage()) {
              <p [class]="isSuccess() ? 'alert-success' : 'alert-error'">{{ formMessage() }}</p>
            }

            <div class="form-actions flex-end">
              <button type="submit" [disabled]="contactForm.invalid || isSubmitting()" class="btn btn-primary">
                @if (isSubmitting()) {
                  <app-loading-spinner size="small"></app-loading-spinner> Sending...
                } @else {
                  Send Message
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-md);
    }
    app-page-header {
      margin-bottom: var(--space-xxl);
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: var(--space-xl);
    }

    .contact-info {
      padding: var(--space-xl);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .contact-info h2 {
      color: var(--color-primary-dark);
      font-size: 1.8rem;
    }
    .contact-info p {
      color: var(--color-text-medium);
      line-height: 1.7;
    }
    .info-item {
      font-size: 1.05rem;
      color: var(--color-text-dark);
    }
    .info-item strong {
      display: inline-block;
      min-width: 80px;
      color: var(--color-text-dark);
    }
    .social-links {
      margin-top: var(--space-lg);
      display: flex;
      gap: var(--space-lg);
      flex-wrap: wrap;
    }
    .social-links a {
      color: var(--color-accent);
      font-weight: 500;
    }
    .social-links a:hover {
      text-decoration: underline;
    }

    .contact-form-wrapper {
      padding: var(--space-xl);
    }
    .contact-form-wrapper h2 {
      color: var(--color-primary-dark);
      font-size: 1.8rem;
      margin-bottom: var(--space-xl);
    }
    .contact-form .form-group {
      margin-bottom: var(--space-lg);
    }
    .form-actions {
      margin-top: var(--space-xl);
    }
    .btn-primary {
      padding: var(--space-md) var(--space-xl);
    }

    /* Responsive Adjustments */
    @media (max-width: 992px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }
      .contact-info {
        order: 2; /* Put contact info below form on smaller screens */
      }
      .contact-form-wrapper {
        order: 1;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactPageComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService); // To simulate API call

  public isSubmitting = signal(false);
  public formMessage = signal<string | null>(null);
  public isSuccess = signal(false);

  public contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  onSubmit(): void {
    this.formMessage.set(null);
    this.isSuccess.set(false);

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.formMessage.set('Please fill in all required fields correctly.');
      this.isSuccess.set(false);
      return;
    }

    this.isSubmitting.set(true);
    const formData = this.contactForm.getRawValue();

    // Simulate API call for contact form submission
    this.api.post('/contact', formData).subscribe({
      next: () => {
        this.formMessage.set('Thank you for your message! We will get back to you soon.');
        this.isSuccess.set(true);
        this.contactForm.reset(); // Clear form on success
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Contact form submission failed', err);
        this.formMessage.set('Failed to send your message. Please try again later.');
        this.isSuccess.set(false);
        this.isSubmitting.set(false);
      }
    });
  }
}