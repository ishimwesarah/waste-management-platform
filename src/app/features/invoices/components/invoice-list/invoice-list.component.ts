import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ApiService } from '../../../../core/services/api.service';
import { Invoice } from '../../../../core/interfaces/invoice.interface';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, RouterLink],
  template: `
    <app-page-header title="Your Invoices" subtitle="Track your payments and outstanding bills"></app-page-header>

    <div class="invoice-list-container card">
      @if (isLoading()) {
        <p class="text-center">Loading invoices...</p>
      } @else if (invoices().length === 0) {
        <p class="text-center">You currently have no invoices.</p>
      } @else {
        <div class="table-responsive">
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (invoice of invoices(); track invoice.id) {
                <tr>
                  <td>{{ invoice.id }}</td>
                  <td>{{ invoice.issueDate }}</td>
                  <td>{{ invoice.dueDate }}</td>
                  <td>{{ invoice.amount | currency:'USD':'symbol':'1.2-2' }}</td>
                  <td><span class="status-badge status-{{invoice.status}}">{{ invoice.status | titlecase }}</span></td>
                  <td class="table-actions">
                    <a [routerLink]="['/invoices', invoice.id]" class="btn btn-secondary btn-sm">View</a>
                    @if (invoice.status === 'pending' || invoice.status === 'overdue') {
                      <a [routerLink]="['/invoices', invoice.id, 'pay']" class="btn btn-primary btn-sm ml-sm">Pay Now</a>
                    }
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
    .invoice-list-container {
      /* .card provides base styling */
    }
    .table-responsive {
      overflow-x: auto;
    }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: var(--space-md);
    }
    .invoice-table th, .invoice-table td {
      border: 1px solid var(--color-border);
      padding: var(--space-md);
      text-align: left;
    }
    .invoice-table th {
      background-color: var(--color-background-light);
      font-weight: 600;
      color: var(--color-text-dark);
    }
    .invoice-table tr:nth-child(even) {
      /* Corrected: Use the pre-defined CSS variable */
      background-color: var(--color-background-even-row);
    }
    .table-actions {
      white-space: nowrap;
    }
    .ml-sm {
      margin-left: var(--space-sm);
    }
    /* .status-badge and specific status styles are global */
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceListComponent {
  private api = inject(ApiService);
  public invoices = signal<Invoice[]>([]);
  public isLoading = signal(true);
  public errorMessage = signal<string | null>(null);

  constructor() {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.isLoading.set(true);
    this.api.get<Invoice[]>('/invoices').subscribe({
      next: (data) => {
        this.invoices.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load invoices', err);
        this.errorMessage.set('Failed to load invoices. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}