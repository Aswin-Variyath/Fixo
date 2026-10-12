import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Navbar } from '../../../../../shared/components/navbar/navbar';
import { Footer } from '../../../../../shared/components/footer/footer';

@Component({
  selector: 'app-login',
  imports: [Navbar, Footer, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
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

  loginWithGoogle(): void {
    window.location.href =
      'http://localhost:3000/auth/google?role=customer';
  }

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
        role: 'customer'
      })
      .subscribe({
        next: () => {
          const pendingRole = sessionStorage.getItem('fixo.pendingRole');

          if (pendingRole !== 'tasker') {
            this.isSubmitting = false;
            this.router.navigate(['/customer/home'], {
              replaceUrl: true
            });
            return;
          }

          this.authService.becomeTasker().subscribe({
            next: () => {
              this.authService.switchRole('tasker').subscribe({
                next: () => {
                  sessionStorage.removeItem('fixo.pendingRole');
                  this.isSubmitting = false;

                  this.router.navigate(['/tasker/dashboard'], {
                    replaceUrl: true
                  });
                },
                error: (error) => {
                  this.isSubmitting = false;
                  this.errorMessage =
                    error?.error?.message ??
                    'Tasker role was added, but switching roles failed. Please try again.';
                }
              });
            },
            error: (error) => {
              this.isSubmitting = false;
              this.errorMessage =
                error?.error?.message ??
                'Unable to add the Tasker role. Please try again.';
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
}