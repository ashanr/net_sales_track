import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="auth-layout">
      <div class="auth-card">
        <div class="auth-header">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
            </svg>
          </div>
          <h1>Sales Track</h1>
          <p>Create your account</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              placeholder="Enter your full name"
              [class.error]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
            />
            <div class="error-message" *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
              <span *ngIf="registerForm.get('name')?.errors?.['required']">Name is required</span>
              <span *ngIf="registerForm.get('name')?.errors?.['minlength']">Name must be at least 2 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="Enter your email"
              [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
            />
            <div class="error-message" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="Enter your password"
              [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
            />
            <div class="error-message" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              placeholder="Confirm your password"
              [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
            />
            <div class="error-message" *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
              <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</span>
            </div>
            <div class="error-message" *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched">
              Passwords do not match
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <button type="submit" class="btn-primary" [disabled]="registerForm.invalid || loading">
            <span *ngIf="!loading">Create Account</span>
            <span *ngIf="loading">Creating account...</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    registerForm: FormGroup;
    loading = false;
    errorMessage = '';
    successMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            return { 'passwordMismatch': true };
        }

        return null;
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.loading = true;
            this.errorMessage = '';
            this.successMessage = '';

            const { confirmPassword, ...registerData } = this.registerForm.value;

            this.authService.register(registerData).subscribe({
                next: () => {
                    this.successMessage = 'Registration successful! Redirecting to login...';
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 2000);
                },
                error: (error) => {
                    this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
                    this.loading = false;
                }
            });
        }
    }
}
