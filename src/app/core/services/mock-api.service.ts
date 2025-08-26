import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, iif } from 'rxjs'; // Import iif
import { delay, tap, switchMap } from 'rxjs/operators'; // Import switchMap
import { User, AuthResponse, LoginPayload } from '../interfaces/user.interface';
import { ScheduleEntry } from '../interfaces/schedule.interface';
import { Invoice } from '../interfaces/invoice.interface';

const MOCK_USERS: User[] = [
  { id: 'usr-001', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', role: 'resident', address: '123 Main St', householdId: 'h001' },
  { id: 'usr-002', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', role: 'collector' },
  { id: 'usr-003', firstName: 'Charlie', lastName: 'Admin', email: 'admin@example.com', role: 'admin' },
];

const MOCK_SCHEDULES: ScheduleEntry[] = [
  { id: 'sch-001', area: 'Main St Area', collectionDate: '2023-10-26', collectionTime: '08:00', status: 'scheduled' },
  { id: 'sch-002', area: 'Oak Ave District', collectionDate: '2023-10-27', collectionTime: '09:30', status: 'collected' },
];

const MOCK_INVOICES: Invoice[] = [
  { id: 'inv-001', userId: 'usr-001', issueDate: '2023-09-15', dueDate: '2023-10-15', amount: 25.00, status: 'pending', services: ['Residential Waste'] },
  { id: 'inv-002', userId: 'usr-001', issueDate: '2023-08-15', dueDate: '2023-09-15', amount: 25.00, status: 'paid', services: ['Residential Waste'], paymentDate: '2023-09-10' },
];

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private users = signal<User[]>(MOCK_USERS);
  private schedules = signal<ScheduleEntry[]>(MOCK_SCHEDULES);
  private invoices = signal<Invoice[]>(MOCK_INVOICES);

  private generateId(prefix: string): string {
    return prefix + Math.random().toString(36).substring(2, 9);
  }

  get<T>(path: string, params?: any): Observable<T> {
    console.log(`MockApiService GET: ${path}`, params);
    return of(null).pipe( // Start with a dummy observable
      delay(500), // Simulate network delay
      switchMap(() => { // Use switchMap to switch to the actual data observable
        if (path === '/auth/user') {
          return of(this.users()[0] as T); // Example: Return a dummy logged-in user
        }
        if (path.includes('/users')) {
          return of(this.users() as T);
        }
        if (path.includes('/schedule')) {
          return of(this.schedules() as T);
        }
        if (path.includes('/invoices')) {
          if (params?.id) {
            const invoice = this.invoices().find(inv => inv.id === params.id);
            if (invoice) return of(invoice as T);
            return throwError(() => new Error('Invoice not found'));
          }
          return of(this.invoices() as T);
        }
        // Fallback for any unhandled GET paths
        return throwError(() => new Error(`MockApiService: Unhandled GET path: ${path}`)) as Observable<T>;
      })
    );
  }

  post<T>(path: string, body: object): Observable<T> {
    console.log(`MockApiService POST: ${path}`, body);
    return of(null).pipe(
      delay(1000),
      switchMap(() => {
        if (path === '/auth/login') {
          const { email, passwordHash } = body as LoginPayload;
          // Simple password check, assuming 'password' is the universal mock password
          const user = this.users().find(u => u.email === email && passwordHash === 'password');
          if (user) {
            return of({ user, token: 'mock-jwt-token' } as AuthResponse as T);
          } else {
            return throwError(() => new Error('Invalid credentials'));
          }
        } else if (path === '/auth/register') {
          const newUserPayload = body as Omit<User, 'id'> & { password: string }; // Use type for clarity
          const newUser: User = {
            id: this.generateId('usr-'),
            firstName: newUserPayload.firstName,
            lastName: newUserPayload.lastName,
            email: newUserPayload.email,
            role: newUserPayload.role,
            address: newUserPayload.address,
            householdId: newUserPayload.householdId
          };
          this.users.update(currentUsers => [...currentUsers, newUser]);
          return of({ user: newUser, token: 'mock-jwt-token' } as AuthResponse as T);
        } else if (path.includes('/invoices')) {
          const newInvoice: Invoice = {
            id: this.generateId('inv-'),
            issueDate: new Date().toISOString().split('T')[0],
            status: 'pending', // Default status for new invoice
            ...body as Omit<Invoice, 'id' | 'issueDate' | 'status'>
          };
          this.invoices.update(currentInvoices => [...currentInvoices, newInvoice]);
          return of(newInvoice as T);
        }
        return throwError(() => new Error(`MockApiService: Unhandled POST path: ${path}`)) as Observable<T>;
      })
    );
  }

  put<T>(path: string, body: object): Observable<T> {
    console.log(`MockApiService PUT: ${path}`, body);
    return of(null).pipe(
      delay(500),
      switchMap(() => {
        if (path.includes('/schedules/')) {
          const id = path.split('/').pop();
          this.schedules.update(current => current.map(s => s.id === id ? { ...s, ...body as ScheduleEntry } : s));
          return of({ success: true } as T);
        } else if (path.includes('/invoices/')) {
          const id = path.split('/').pop();
          this.invoices.update(current => current.map(inv => inv.id === id ? { ...inv, ...body as Invoice } : inv));
          return of({ success: true } as T);
        }
        return throwError(() => new Error(`MockApiService: Unhandled PUT path: ${path}`)) as Observable<T>;
      })
    );
  }

  delete<T>(path: string, params?: any): Observable<T> {
    console.log(`MockApiService DELETE: ${path}`, params);
    return of(null).pipe(
      delay(500),
      switchMap(() => {
        if (path.includes('/users/')) {
          const id = path.split('/').pop();
          this.users.update(current => current.filter(u => u.id !== id));
          return of({ success: true } as T);
        }
        return throwError(() => new Error(`MockApiService: Unhandled DELETE path: ${path}`)) as Observable<T>;
      })
    );
  }
}