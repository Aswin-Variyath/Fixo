import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Navbar } from '../../../../../shared/components/navbar/navbar';
import { Footer } from '../../../../../shared/components/footer/footer';

@Component({
  selector: 'app-signup',
  imports: [Navbar, Footer, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly signupForm = new FormGroup(
    {
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),

      phone: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
          ),
        ],
      }),

      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    {
      validators: (form) => {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;

        return password === confirmPassword
          ? null
          : { passwordMismatch: true };
      },
    }
  );

  isSubmitting = false;
  errorMessage = '';

  loginWithGoogle(): void {
    window.location.href =
      'http://localhost:3000/auth/google?role=customer';
  }

  submit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.signup(this.signupForm.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting = false;

        this.router.navigate(['/customer/home'], {
          replaceUrl: true,
        });
      },

      error: (error) => {
        this.isSubmitting = false;

        const message = error?.error?.message ?? '';

        if (
          error?.status === 409 &&
          message
            .toLowerCase()
            .includes('sign in to add the customer role')
        ) {
          const confirmed = window.confirm(
            'This email already has a Tasker account. Do you want to sign in and add the Customer role?'
          );

          if (confirmed) {
            sessionStorage.setItem('fixo.pendingRole', 'customer');

            this.router.navigate(['/tasker/login']);
            return;
          }

          this.errorMessage = 'Customer registration cancelled.';
          return;
        }

        this.errorMessage =
          message || 'Unable to create account. Please try again.';
      },
    });
  }
}