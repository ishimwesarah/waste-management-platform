// src/app/features/invoices/invoices.routes.ts
import { Routes } from '@angular/router';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './components/invoice-detail/invoice-detail.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';

export const invoicesRoutes: Routes = [
  { path: '', component: InvoiceListComponent },
  { path: ':id', component: InvoiceDetailComponent },
  { path: ':id/pay', component: PaymentFormComponent }
];