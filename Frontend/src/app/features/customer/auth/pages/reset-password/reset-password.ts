import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../../../../../core/auth/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit, OnDestroy {

  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder)

  resetForm = this.fb.group({
    password:['',Validators.required],
    confirmPassword:['',Validators.required]
  })

  expiresAt!: string;

  remainingSeconds = signal(0);
  countDown = signal('00:00');

  private timerSubscription?: Subscription;

  ngOnInit(): void {

    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.router.navigate(['/forgot-password']);
      return;
    }

    this.authService.validateResetToken(token).subscribe({
      next: (response) => {

        console.log('Reset token response:', response);

        this.expiresAt = response.data.expiresAt;

        console.log('Expires At:', this.expiresAt);

        this.startTimer();
      },

      error: (error) => {
        console.error('Reset token validation failed:', error);

        this.router.navigate(['/forgot-password']);
      },
    });
  }

  onSubmit(): void {
  if (this.remainingSeconds() <= 0) {
    return;
  }

  if (this.resetForm.invalid) {
    this.resetForm.markAllAsTouched();
    return;
  }

  const password = this.resetForm.value.password!;
  const confirmPassword = this.resetForm.value.confirmPassword!;

  if (password !== confirmPassword) {
    console.log('Passwords do not match');
    return;
  }

  const token = this.route.snapshot.queryParamMap.get('token');

  if (!token) {
    return;
  }

  this.authService.resetPassword({
    token,
    password,
  }).subscribe({
    next: (response) => {
      console.log('Password reset successfully', response);

      // Next step: show success state
    },
    error: (error) => {
      console.error('Password reset failed', error);
    },
  });
}

  private startTimer(): void {

    this.updateTimer();

    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateTimer();
    });
  }

  private updateTimer(): void {

    const expiresTime = new Date(this.expiresAt).getTime();
    const currentTime = Date.now();

    const remaining = expiresTime - currentTime;

    const secondsLeft = Math.max(
      0,
      Math.floor(remaining / 1000)
    );

    this.remainingSeconds.set(secondsLeft);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    const formattedTime =
      `${minutes.toString().padStart(2, '0')}:` +
      `${seconds.toString().padStart(2, '0')}`;

    this.countDown.set(formattedTime);

    console.log('Countdown:', formattedTime);

    if (secondsLeft === 0) {
      this.timerSubscription?.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}