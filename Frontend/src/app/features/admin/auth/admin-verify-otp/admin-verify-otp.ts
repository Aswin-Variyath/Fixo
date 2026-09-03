import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
  signal
} from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { AdminOtpStateService } from '../../../../core/auth/admin-otp-state.service';

@Component({
  selector: 'app-admin-verify-otp',
  imports: [],
  templateUrl: './admin-verify-otp.html',
  styleUrl: './admin-verify-otp.css',
})
export class AdminVerifyOtp implements OnInit, OnDestroy {

  private readonly authService = inject(AuthService);
  private readonly otpState = inject(AdminOtpStateService);
  private readonly router = inject(Router);

  @ViewChildren('otpInput')
  private readonly otpInputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  // -----------------------------
  // OTP INPUT STATE
  // -----------------------------

  otpValues = ['', '', '', '', '', ''];

  // -----------------------------
  // TIMER STATE
  // -----------------------------

  otpRemainingSeconds = signal(0);
  resendRemainingSeconds = signal(0);

  // -----------------------------
  // API STATE
  // -----------------------------

  isVerifying = false;
  isResending = false;
  errorMessage = '';

  private timerId?: ReturnType<typeof setInterval>;

  // -----------------------------
  // INITIALIZATION
  // -----------------------------

  ngOnInit(): void {

    console.log('AdminVerifyOtp ngOnInit');

    const session = this.otpState.getSession();

    console.log(
      'OTP session on verify page:',
      session
    );

    // No OTP session means the user should
    // not be able to directly access this page.
    if (!session) {

      console.log('No OTP session found');

      this.router.navigate(['/admin/signin']);

      return;
    }

    // Set initial timer values immediately.
    this.updateTimers();

    // Start timer.
    this.startTimer();
  }

  // -----------------------------
  // TIMER
  // -----------------------------

  private startTimer(): void {

    // Prevent multiple intervals.
    if (this.timerId) {
      return;
    }

    this.timerId = setInterval(() => {
      this.updateTimers();
    }, 1000);
  }

  private updateTimers(): void {

    this.otpRemainingSeconds.set(
      this.otpState.getOtpRemainingSeconds()
    );

    this.resendRemainingSeconds.set(
      this.otpState.getResendRemainingSeconds()
    );

    // Stop interval once both timers are finished.
    if (
      this.otpRemainingSeconds() === 0 &&
      this.resendRemainingSeconds() === 0
    ) {
      this.stopTimer();
    }
  }

  get otpExpired(): boolean {
    return this.otpRemainingSeconds() === 0;
  }

  get canResend(): boolean {
    return this.resendRemainingSeconds() === 0;
  }

  // -----------------------------
  // OTP STATE
  // -----------------------------

  get isOtpComplete(): boolean {

    return this.otpValues.every(
      value => value.length === 1
    );
  }

  get otp(): string {

    return this.otpValues.join('');
  }

  // -----------------------------
  // OTP INPUT
  // -----------------------------

  onOtpInput(
    event: Event,
    index: number
  ): void {

    const input =
      event.target as HTMLInputElement;

    const value = input.value;

    // Allow numbers only.
    const digit =
      value.replace(/\D/g, '').slice(-1);

    this.otpValues[index] = digit;

    // Keep actual input synchronized.
    input.value = digit;

    // Clear previous error when user
    // starts entering a new OTP.
    this.errorMessage = '';

    // Move focus to next input.
    if (
      digit &&
      index < 5
    ) {
      this.focusInput(index + 1);
    }
  }

  // -----------------------------
  // BACKSPACE
  // -----------------------------

  onOtpKeydown(
    event: KeyboardEvent,
    index: number
  ): void {

    if (
      event.key === 'Backspace' &&
      !this.otpValues[index] &&
      index > 0
    ) {
      this.focusInput(index - 1);
    }
  }

  // -----------------------------
  // OTP PASTE
  // -----------------------------

  onOtpPaste(
    event: ClipboardEvent
  ): void {

    event.preventDefault();

    const pastedText =
      event.clipboardData?.getData('text') ?? '';

    const digits =
      pastedText
        .replace(/\D/g, '')
        .slice(0, 6);

    if (!digits) {
      return;
    }

    this.otpValues = [
      ...digits.split(''),
      ...Array(6 - digits.length).fill('')
    ];

    this.errorMessage = '';

    const focusIndex =
      Math.min(digits.length, 5);

    this.focusInput(focusIndex);
  }

  // -----------------------------
  // FOCUS OTP INPUT
  // -----------------------------

  private focusInput(index: number): void {

    const input =
      this.otpInputs
        .get(index)
        ?.nativeElement;

    input?.focus();
  }

  // -----------------------------
  // CLEAR OTP
  // -----------------------------

  clearOtp(): void {

    this.otpValues = [
      '',
      '',
      '',
      '',
      '',
      ''
    ];

    this.focusInput(0);
  }

  // -----------------------------
  // FORMAT TIMER
  // -----------------------------

  formatTime(totalSeconds: number): string {

    const minutes =
      Math.floor(totalSeconds / 60);

    const seconds =
      totalSeconds % 60;

    return `${minutes
      .toString()
      .padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  // -----------------------------
  // VERIFY OTP
  // -----------------------------

  verifyOtp(): void {

    console.log('VERIFY BUTTON CLICKED');

    console.log(
      'OTP complete:',
      this.isOtpComplete
    );

    console.log(
      'OTP:',
      this.otp
    );

    // Prevent verification if:
    // - OTP is incomplete
    // - verification is already running
    // - resend request is running
    if (
      !this.isOtpComplete ||
      this.isVerifying ||
      this.isResending
    ) {
      console.log('Verify blocked');
      return;
    }

    const challengeId =
      this.otpState.getChallengeId();

    console.log(
      'Challenge ID:',
      challengeId
    );

    if (!challengeId) {

      console.log('No challenge ID');

      this.errorMessage =
        'Your OTP session has expired. Please sign in again.';

      this.router.navigate(['/admin/signin']);

      return;
    }

    this.isVerifying = true;
    this.errorMessage = '';

    console.log(
      'Calling verifyAdminOtp API...'
    );

    this.authService.verifyAdminOtp({
      challengeId,
      otp: this.otp
    }).subscribe({

      next: (response) => {

        console.log(
          'Admin OTP verified:',
          response
        );

        this.isVerifying = false;

        // OTP session is no longer required
        // after successful authentication.
        this.otpState.clearSession();

        console.log(
          'Navigating to dashboard...'
        );

        this.router
          .navigate(['/admin/dashboard'])
          .then(success => {

            console.log(
              'Dashboard navigation result:',
              success
            );

          })
          .catch(error => {

            console.error(
              'Dashboard navigation error:',
              error
            );

          });
      },

      error: (error) => {

        console.error(
          'Admin OTP verification API error:',
          error
        );

        console.error(
          'Backend error:',
          error?.error
        );

        this.isVerifying = false;

        this.errorMessage =
          error?.error?.message ??
          'Invalid OTP. Please try again.';
      }

    });
  }

  // -----------------------------
  // RESEND OTP
  // -----------------------------

  resendOtp(): void {

    // Don't resend while:
    // - cooldown is active
    // - another resend request is running
    if (
      !this.canResend ||
      this.isResending
    ) {
      return;
    }

    const challengeId =
      this.otpState.getChallengeId();

    if (!challengeId) {

      this.errorMessage =
        'Your OTP session has expired. Please sign in again.';

      this.router.navigate(['/admin/signin']);

      return;
    }

    this.isResending = true;
    this.errorMessage = '';

    console.log(
      'Resending admin OTP...'
    );

    this.authService.resendAdminOtp({
      challengeId
    }).subscribe({

      next: (response) => {

        console.log(
          'Admin OTP resent successfully:',
          response
        );

        this.isResending = false;

        // Clear the previous OTP.
        this.clearOtp();

        // Save the NEW challengeId and
        // restart the OTP/resend timers.
        this.otpState.updateSession(
          response.data.challengeId,
          response.data.otpExpiresIn,
          response.data.resendAfter
        );

        // Immediately update timer values.
        this.updateTimers();

        // Make sure timer is running.
        this.startTimer();

        // Focus first OTP input.
        this.focusInput(0);
      },

      error: (error) => {

        console.error(
          'Admin OTP resend API error:',
          error
        );

        console.error(
          'Backend error:',
          error?.error
        );

        this.isResending = false;

        this.errorMessage =
          error?.error?.message ??
          'Unable to resend OTP. Please try again.';
      }

    });
  }

  // -----------------------------
  // STOP TIMER
  // -----------------------------

  private stopTimer(): void {

    if (this.timerId) {

      clearInterval(this.timerId);

      this.timerId = undefined;
    }
  }

  // -----------------------------
  // DESTROY
  // -----------------------------

  ngOnDestroy(): void {

    this.stopTimer();
  }
}