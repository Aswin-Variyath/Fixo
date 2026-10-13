import { Component, inject } from '@angular/core';
import { Navbar } from '../../../landing/components/navbar/navbar';
import { Footer } from '../../../../../shared/components/footer/footer';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';

@Component({
  selector: 'app-tasker-login',
  imports: [Navbar, Footer, ReactiveFormsModule, RouterLink],
  templateUrl: './tasker-login.html',
  styleUrl: './tasker-login.css',
})
export class TaskerLogin {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        )
      ]
    })
  });

  isSubmitting = false;
  errorMessage = '';

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService
      .login({
        ...this.loginForm.getRawValue(),
        role: 'tasker'
      })
      .subscribe({
        next: () => {
          const pendingRole = sessionStorage.getItem('fixo.pendingRole');

          if (pendingRole !== 'customer') {
            this.isSubmitting = false;
            this.router.navigate(['/tasker/dashboard'], {
              replaceUrl: true
            });
            return;
          }

          this.authService.becomeCustomer().subscribe({
            next: () => {
              this.authService.switchRole('customer').subscribe({
                next: () => {
                  sessionStorage.removeItem('fixo.pendingRole');
                  this.isSubmitting = false;

                  this.router.navigate(['/customer/home'], {
                    replaceUrl: true
                  });
                },
                error: (error) => {
                  this.isSubmitting = false;
                  this.errorMessage =
                    error?.error?.message ??
                    'Customer role was added, but switching roles failed. Please try again.';
                }
              });
            },
            error: (error) => {
              this.isSubmitting = false;
              this.errorMessage =
                error?.error?.message ??
                'Unable to add the Customer role. Please try again.';
            }
          });
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage =
            error?.error?.message ??
            'Unable to login. Please try again.';
        }
      });
  }

  loginWithGoogle(): void {
    window.location.href =
      'http://localhost:3000/auth/google?role=tasker';
  }
}