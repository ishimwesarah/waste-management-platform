import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="login-container">
      <h2 class="form-title">Login to WasteWise Connect</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email:</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="form-input"
            [class.is-invalid]="loginForm.get('email')?.invalid && (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)"
            aria-required="true"
            aria-label="Enter your email address"
          />
          @if (loginForm.get('email')?.invalid && (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)) {
            <p class="error-message" role="alert">
              @if (loginForm.get('email')?.errors?.['required']) {
                Email is required.
              } @else if (loginForm.get('email')?.errors?.['email']) {
                Please enter a valid email.
              }
            </p>
          }
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password:</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            class="form-input"
            [class.is-invalid]="loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)"
            aria-required="true"
            aria-label="Enter your password"
          />
          @if (loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)) {
            <p class="error-message" role="alert">
              @if (loginForm.get('password')?.errors?.['required']) {
                Password is required.
              }
            </p>
          }
        </div>

        @if (errorMessage()) {
          <p class="alert-error" role="alert">{{ errorMessage() }}</p>
        }

        <button type="submit" [disabled]="loginForm.invalid || isLoading()" class="btn btn-primary">
          @if (isLoading()) {
            <app-loading-spinner size="small"></app-loading-spinner> Logging In...
          } @else {
            Login
          }
        </button>
      </form>
      <p class="register-link mt-lg">
        Don't have an account? <a routerLink="/register">Register here</a>
      </p>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      /* Adjust min-height to account for new header/footer heights from layouts */
      min-height: calc(100vh - (var(--space-md) * 2 + 50px) - (var(--space-xl) * 2 + 30px));
      padding: var(--space-xl) 0;
    }
    .login-container {
      background-color: var(--color-surface);
      padding: var(--space-xxl);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 450px;
      text-align: center;
    }
    .form-title {
      color: var(--color-primary-dark);
      margin-bottom: var(--space-xl);
      font-size: 2rem;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }
    .form-group {
      text-align: left;
    }
    /* form-label and form-input styles are global now via src/styles.scss, but can be overridden here if needed */
    .register-link {
      font-size: 0.95rem;
      color: var(--color-text-medium);
    }
    .register-link a {
      color: var(--color-primary-dark);
      text-decoration: none;
      font-weight: 600;
    }
    .register-link a:hover {
      text-decoration: underline;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);

  public loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    this.errorMessage.set(null);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage.set('Please fill in all required fields correctly.');
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.loginForm.getRawValue();

    const loginPayload = {
        email,
        passwordHash: password
    };

    this.authService.login(loginPayload).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (error.status === 401 || error.status === 403) {
          this.errorMessage.set('Invalid credentials. Please try again.');
        } else {
          this.errorMessage.set('An unexpected error occurred. Please try again later.');
          console.error('Login error:', error);
        }
      }
    });
  }
}