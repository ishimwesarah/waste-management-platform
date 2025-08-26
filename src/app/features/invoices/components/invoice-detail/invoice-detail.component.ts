import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ApiService } from '../../../../core/services/api.service';
import { Invoice } from '../../../../core/interfaces/invoice.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, take } from 'rxjs';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, RouterLink, LoadingSpinnerComponent],
  template: `
    <app-page-header title="Invoice Details" subtitle="Review your invoice information"></app-page-header>

    <div class="invoice-detail-container">
      @if (isLoading()) {
        <app-loading-spinner></app-loading-spinner>
      } @else if (errorMessage()) {
        <p class="alert-error">{{ errorMessage() }}</p>
        <div class="flex-center mt-md">
          <a routerLink="/invoices" class="btn btn-secondary">Back to Invoices</a>
        </div>
      } @else if (invoice()) {
        <div class="invoice-card card">
          <div class="invoice-header">
            <h3>Invoice #{{ invoice()?.id }}</h3>
            <span class="status-badge status-{{ invoice()?.status }}">{{ invoice()?.status | titlecase }}</span>
          </div>
          <div class="invoice-body">
            <p><strong>Issued:</strong> {{ invoice()?.issueDate }}</p>
            <p><strong>Due:</strong> {{ invoice()?.dueDate }}</p>
            <p class="invoice-amount"><strong>Amount:</strong> {{ invoice()?.amount | currency:'USD':'symbol':'1.2-2' }}</p>
            <p><strong>Services:</strong> {{ invoice()?.services?.join(', ') }}</p>
            @if (invoice()?.status === 'paid' && invoice()?.paymentDate) {
              <p><strong>Payment Date:</strong> {{ invoice()?.paymentDate }}</p>
            }
          </div>
          <div class="invoice-actions flex-end gap-md">
            <a routerLink="/invoices" class="btn btn-secondary">Back to List</a>
            @if (invoice()?.status === 'pending' || invoice()?.status === 'overdue') {
              <a [routerLink]="['/invoices', invoice()?.id, 'pay']" class="btn btn-primary">Proceed to Payment</a>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .invoice-detail-container {
      max-width: 800px;
      margin: var(--space-xl) auto;
    }
    .invoice-card {
      /* .card provides base styling */
      padding: 0; /* Remove default card padding */
      overflow: hidden;
    }
    .invoice-header {
      background-color: var(--color-background-light);
      padding: var(--space-xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--color-border);
    }
    .invoice-header h3 {
      margin: 0;
      color: var(--color-text-dark);
      font-size: 1.5rem;
    }
    /* .status-badge is globally styled */
    .invoice-body {
      padding: var(--space-xl);
      line-height: 1.8;
      font-size: 1rem;
      color: var(--color-text-medium);
    }
    .invoice-body p {
      margin-bottom: var(--space-sm);
    }
    .invoice-body strong {
      color: var(--color-text-dark);
    }
    .invoice-amount {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-primary-dark);
    }
    .invoice-actions {
      padding: var(--space-xl);
      border-top: 1px solid var(--color-border);
    }
    /* .flex-end, .gap-md, .btn-primary, .btn-secondary, alert-error are globally styled */
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDetailComponent {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public invoice = signal<Invoice | null>(null);
  public isLoading = signal(true);
  public errorMessage = signal<string | null>(null);

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
        return [];
      }),
      take(1)
    ).subscribe({
      next: (invoice) => {
        this.invoice.set(invoice);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load invoice', err);
        this.errorMessage.set('Invoice not found or failed to load details.');
        this.isLoading.set(false);
      }
    });
  }
}