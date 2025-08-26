import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ApiService } from '../../../../core/services/api.service';
import { Invoice } from '../../../../core/interfaces/invoice.interface';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { switchMap, take, delay } from 'rxjs/operators';
import { of,  } from 'rxjs'; 
import { HttpErrorResponse } from '@angular/common/http';// Corrected HttpErrorResponse import

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <app-page-header title="Make Payment" subtitle="Complete your payment for outstanding invoices"></app-page-header>

    <div class="payment-form-container card">
      @if (isLoading()) {
        <app-loading-spinner></app-loading-spinner>
      } @else if (errorMessage()) {
        <p class="alert-error">{{ errorMessage() }}</p>
        <div class="flex-center mt-md">
          <a routerLink="/invoices" class="btn btn-secondary">Back to Invoices</a>
        </div>
      } @else if (invoice()) {
        <div class="invoice-summary">
          <h3>Invoice #{{ invoice()?.id }}</h3>
          <p class="invoice-amount"><strong>Amount Due:</strong> {{ invoice()?.amount | currency:'USD':'symbol':'1.2-2' }}</p>
          <p><strong>Due Date:</strong> {{ invoice()?.dueDate }}</p>
          <span class="status-badge status-{{ invoice()?.status }}">{{ invoice()?.status | titlecase }}</span>
        </div>

        @if (invoice()?.status === 'paid') {
          <p class="alert-success mt-lg text-center">This invoice has already been paid on {{ invoice()?.paymentDate }}.</p>
          <div class="flex-center mt-md">
            <a routerLink="/invoices" class="btn btn-primary">Back to Invoices</a>
          </div>
        } @else {
          <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()" class="payment-form">
            <div class="form-group">
              <label for="cardNumber" class="form-label">Card Number:</label>
              <input type="text" id="cardNumber" formControlName="cardNumber" class="form-input" placeholder="XXXX XXXX XXXX XXXX"
                     [class.is-invalid]="paymentForm.get('cardNumber')?.invalid && (paymentForm.get('cardNumber')?.dirty || paymentForm.get('cardNumber')?.touched)" />
              @if (paymentForm.get('cardNumber')?.invalid && (paymentForm.get('cardNumber')?.dirty || paymentForm.get('cardNumber')?.touched)) {
                <p class="error-message">Valid 16-digit card number is required.</p>
              }
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="expiryDate" class="form-label">Expiry Date:</label>
                <input type="text" id="expiryDate" formControlName="expiryDate" class="form-input" placeholder="MM/YY"
                       [class.is-invalid]="paymentForm.get('expiryDate')?.invalid && (paymentForm.get('expiryDate')?.dirty || paymentForm.get('expiryDate')?.touched)" />
                @if (paymentForm.get('expiryDate')?.invalid && (paymentForm.get('expiryDate')?.dirty || paymentForm.get('expiryDate')?.touched)) {
                  <p class="error-message">Valid expiry date (MM/YY) is required.</p>
                }
              </div>
              <div class="form-group">
                <label for="cvv" class="form-label">CVV:</label>
                <input type="text" id="cvv" formControlName="cvv" class="form-input" placeholder="XXX"
                       [class.is-invalid]="paymentForm.get('cvv')?.invalid && (paymentForm.get('cvv')?.dirty || paymentForm.get('cvv')?.touched)" />
                @if (paymentForm.get('cvv')?.invalid && (paymentForm.get('cvv')?.dirty || paymentForm.get('cvv')?.touched)) {
                  <p class="error-message">Valid 3 or 4 digit CVV is required.</p>
                }
              </div>
            </div>

            <div class="form-group">
              <label for="cardHolderName" class="form-label">Cardholder Name:</label>
              <input type="text" id="cardHolderName" formControlName="cardHolderName" class="form-input"
                     [class.is-invalid]="paymentForm.get('cardHolderName')?.invalid && (paymentForm.get('cardHolderName')?.dirty || paymentForm.get('cardHolderName')?.touched)" />
              @if (paymentForm.get('cardHolderName')?.invalid && (paymentForm.get('cardHolderName')?.dirty || paymentForm.get('cardHolderName')?.touched)) {
                <p class="error-message">Cardholder name is required.</p>
              }
            </div>

            @if (paymentError()) {
              <p class="alert-error">{{ paymentError() }}</p>
            }
            @if (paymentSuccess()) {
              <p class="alert-success">{{ paymentSuccess() }}</p>
            }

            <div class="form-actions flex-end gap-md">
              <button type="submit" [disabled]="paymentForm.invalid || isProcessing()" class="btn btn-primary">
                @if (isProcessing()) {
                  <app-loading-spinner size="small"></app-loading-spinner> Processing...
                } @else {
                  Pay Now
                }
              </button>
              <a [routerLink]="['/invoices', invoice()?.id]" class="btn btn-secondary">Cancel</a>
            </div>
          </form>
        }
      }
    </div>
  `,
  styles: `
    .payment-form-container {
      /* .card provides base styling */
      max-width: 600px;
      margin: var(--space-xl) auto;
    }
    .invoice-summary {
      background-color: var(--color-background-light);
      padding: var(--space-xl);
      border-radius: var(--border-radius);
      margin-bottom: var(--space-xxl);
      text-align: center;
      border: 1px solid var(--color-border);
    }
    .invoice-summary h3 {
      margin-top: 0;
      color: var(--color-primary-dark);
      font-size: 1.8rem;
      margin-bottom: var(--space-md);
    }
    .invoice-summary p {
      margin-bottom: var(--space-sm);
      font-size: 1.1rem;
      color: var(--color-text-medium);
    }
    .invoice-amount {
      font-weight: 600;
      color: var(--color-accent-dark);
    }
    /* .status-badge is globally styled */

    .payment-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }
    .form-group {
      margin-bottom: 0; /* Override global form-group margin */
    }
    .form-row {
      display: flex;
      gap: var(--space-lg);
    }
    .form-row .form-group {
      flex: 1;
    }
    /* form-label, form-input, error-message, alert-error, alert-success, btn-primary, btn-secondary are globally styled */
    .form-actions {
      margin-top: var(--space-xl);
    }
    .mt-lg { margin-top: var(--space-lg); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentFormComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public invoice = signal<Invoice | null>(null);
  public isLoading = signal(true);
  public isProcessing = signal(false);
  public errorMessage = signal<string | null>(null);
  public paymentError = signal<string | null>(null);
  public paymentSuccess = signal<string | null>(null);

  public paymentForm = this.fb.nonNullable.group({
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]], // MM/YY
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    cardHolderName: ['', [Validators.required]],
  });

  constructor() {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.isLoading.set(true);
        this.errorMessage.set(null);
        const id = params.get('id');
        if (id) {
          return this.api.get<Invoice>(`/invoices/${id}`);
        }
        this.router.navigate(['/invoices']);
        return of(null);
      }),
      take(1)
    ).subscribe({
      next: (invoice) => {
        if (!invoice) {
          this.errorMessage.set('Invoice not found or no ID provided.');
          this.isLoading.set(false);
          return;
        }
        if (invoice.status === 'paid') {
          this.paymentForm.disable();
        }
        this.invoice.set(invoice);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load invoice for payment', err);
        this.errorMessage.set('Invoice not found or failed to load details.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    this.paymentError.set(null);
    this.paymentSuccess.set(null);
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      this.paymentError.set('Please fill in all payment details correctly.');
      return;
    }

    if (!this.invoice()) {
      this.paymentError.set('No invoice selected for payment.');
      return;
    }

    this.isProcessing.set(true);

    of(null).pipe(delay(2000), take(1)).subscribe({
      next: () => {
        const updatedInvoice: Invoice = {
          ...this.invoice()!,
          status: 'paid',
          paymentDate: new Date().toISOString().split('T')[0]
        };
        this.api.put<Invoice>(`/invoices/${updatedInvoice.id}`, updatedInvoice).pipe(take(1)).subscribe({
          next: () => {
            this.invoice.set(updatedInvoice);
            this.paymentForm.disable();
            this.paymentSuccess.set('Payment successful! Redirecting to invoice details...');
            this.isProcessing.set(false);
            setTimeout(() => {
              this.router.navigate(['/invoices', updatedInvoice.id]);
            }, 2000);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Failed to update invoice status after payment', err);
            this.paymentError.set('Payment processed, but failed to update invoice status. Please check your payment history.');
            this.isProcessing.set(false);
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Mock payment processing failed', err);
        this.paymentError.set('Payment processing failed. Please try again.');
        this.isProcessing.set(false);
      }
    });
  }
}