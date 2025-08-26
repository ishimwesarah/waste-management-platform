// src/app/core/services/auth.service.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, LoginPayload, User } from '../interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Use signal for current user state
  public currentUser = signal<User | null>(null);
  // Use computed for derived state (isLoggedIn)
  public isLoggedIn = computed(() => !!this.currentUser());

  constructor() {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage(): void {
    try {
      const user = localStorage.getItem('currentUser');
      const token = localStorage.getItem('authToken');
      if (user && token) {
        this.currentUser.set(JSON.parse(user));
        // In a real app, you'd want to validate the token and refresh it if needed
      }
    } catch (e) {
      console.error('Failed to load user from local storage:', e);
      this.logout(); // Clear potentially corrupted data
    }
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    // Assuming API returns { user: User, token: string }
    return this.apiService.post<AuthResponse>('/auth/login', payload).pipe(
      tap(response => {
        this.currentUser.set(response.user);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  register(payload: Omit<User, 'id'> & { password: string }): Observable<AuthResponse> {
    // Assuming API returns { user: User, token: string }
    return this.apiService.post<AuthResponse>('/auth/register', payload).pipe(
      tap(response => {
        this.currentUser.set(response.user);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}