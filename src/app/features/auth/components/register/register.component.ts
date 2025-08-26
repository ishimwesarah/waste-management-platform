import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../../core/interfaces/user.interface'; // Import User for type assertion

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="register-container">
      <h2 class="form-title">Create Your WasteWise Connect Account</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
        <div class="form-group">
          <label for="firstName" class="form-label">First Name:</label>
          <input type="text" id="firstName" formControlName="firstName" class="form-input"
                 [class.is-invalid]="registerForm.get('firstName')?.invalid && (registerForm.get('firstName')?.dirty || registerForm.get('firstName')?.touched)"
                 aria-required="true" aria-label="Enter your first name" />
          @if (registerForm.get('firstName')?.invalid && (registerForm.get('firstName')?.dirty || registerForm.get('firstName')?.touched)) {
            <p class="error-message" role="alert">First Name is required.</p>
          }
        </div>

        <div class="form-group">
          <label for="lastName" class="form-label">Last Name:</label>
          <input type="text" id="lastName" formControlName="lastName" class="form-input"
                 [class.is-invalid]="registerForm.get('lastName')?.invalid && (registerForm.get('lastName')?.dirty || registerForm.get('lastName')?.touched)"
                 aria-required="true" aria-label="Enter your last name" />
          @if (registerForm.get('lastName')?.invalid && (registerForm.get('lastName')?.dirty || registerForm.get('lastName')?.touched)) {
            <p class="error-message" role="alert">Last Name is required.</p>
          }
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email:</label>
          <input type="email" id="email" formControlName="email" class="form-input"
                 [class.is-invalid]="registerForm.get('email')?.invalid && (registerForm.get('email')?.dirty || registerForm.get('email')?.touched)"
                 aria-required="true" aria-label="Enter your email address" />
          @if (registerForm.get('email')?.invalid && (registerForm.get('email')?.dirty || registerForm.get('email')?.touched)) {
            <p class="error-message" role="alert">
              @if (registerForm.get('email')?.errors?.['required']) {
                Email is required.
              } @else if (registerForm.get('email')?.errors?.['email']) {
                Please enter a valid email.
              }
            </p>
          }
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password:</label>
          <input type="password" id="password" formControlName="password" class="form-input"
                 [class.is-invalid]="registerForm.get('password')?.invalid && (registerForm.get('password')?.dirty || registerForm.get('password')?.touched)"
                 aria-required="true" aria-label="Enter your password" />
          @if (registerForm.get('password')?.invalid && (registerForm.get('password')?.dirty || registerForm.get('password')?.touched)) {
            <p class="error-message" role="alert">
              @if (registerForm.get('password')?.errors?.['required']) {
                Password is required.
              } @else if (registerForm.get('password')?.errors?.['minlength']) {
                Password must be at least 6 characters long.
              }
            </p>
          }
        </div>

        <div class="form-group">
          <label for="role" class="form-label">Role:</label>
          <select id="role" formControlName="role" class="form-select"
                  [class.is-invalid]="registerForm.get('role')?.invalid && (registerForm.get('role')?.dirty || registerForm.get('role')?.touched)"
                  aria-required="true" aria-label="Select your role">
            <option value="" disabled>Select a role</option>
            <option value="resident">Resident</option>
            <!-- Add other roles if applicable: -->
            <!-- <option value="collector">Collector</option> -->
            <!-- <option value="admin">Admin</option> -->
          </select>
          @if (registerForm.get('role')?.invalid && (registerForm.get('role')?.dirty || registerForm.get('role')?.touched)) {
            <p class="error-message" role="alert">Role is required.</p>
          }
        </div>

        @if (errorMessage()) {
          <p class="alert-error" role="alert">{{ errorMessage() }}</p>
        }

        <button type="submit" [disabled]="registerForm.invalid || isLoading()" class="btn btn-primary">
          @if (isLoading()) {
            <app-loading-spinner size="small"></app-loading-spinner> Registering...
          } @else {
            Register
          }
        </button>
      </form>
      <p class="login-link mt-lg">
        Already have an account? <a routerLink="/login">Login here</a>
      </p>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - (var(--space-md) * 2 + 50px) - (var(--space-xl) * 2 + 30px));
      padding: var(--space-xl) 0;
    }
    .register-container {
      background-color: var(--color-surface);
      padding: var(--space-xxl);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 500px;
      text-align: center;
    }
    .form-title {
      color: var(--color-primary-dark);
      margin-bottom: var(--space-xl);
      font-size: 2rem;
    }
    .register-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }
    .form-group {
      text-align: left;
    }
    /* form-label, form-input, form-select, error-message, alert-error are globally styled */
    .login-link {
      font-size: 0.95rem;
      color: var(--color-text-medium);
    }
    .login-link a {
      color: var(--color-primary-dark);
      text-decoration: none;
      font-weight: 600;
    }
    .login-link a:hover {
      text-decoration: underline;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);

  public registerForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['resident' as User['role'], [Validators.required]]
  });

  onSubmit(): void {
    this.errorMessage.set(null);
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage.set('Please fill in all required fields correctly.');
      return;
    }

    this.isLoading.set(true);
    const { firstName, lastName, email, password, role } = this.registerForm.getRawValue();

    this.authService.register({ firstName, lastName, email, password, role }).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (error.status === 409) {
          this.errorMessage.set('User with this email already exists.');
        } else {
          this.errorMessage.set('Registration failed. Please try again later.');
          console.error('Registration error:', error);
        }
      }
    });
  }
}