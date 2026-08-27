import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

/*
 * BookingProgress
 * ---------------
 * Shared progress indicator for the multi-step booking flow.
 *
 * Usage:
 *   <app-booking-progress [currentStep]="1" />                    ← Appointment page
 *   <app-booking-progress [currentStep]="2" />                    ← Booking Details page
 *   <app-booking-progress [currentStep]="3" />                    ← Payment page
 *   <app-booking-progress [currentStep]="4" />                    ← Confirmation page
 *   <app-booking-progress [currentStep]="3" [failedStep]="3" />  ← Payment Failed page
 *
 * Step state logic:
 *   stepNumber === failedStep                  → failed    (close icon, error colours)
 *   stepNumber < currentStep (and not failed)  → completed (check icon, primary colours)
 *   stepNumber === currentStep (and not failed) → active   (number, primary colours)
 *   stepNumber > currentStep                   → inactive  (number, surface-variant colours)
 *
 * Connector state logic:
 *   connector after step N:  if N < currentStep → bg-primary/50 (completed)
 *                            else               → bg-glass-stroke (upcoming)
 *
 * Default failedStep = 0 means no step is in a failed state.
 * All existing pages that omit [failedStep] are unaffected.
 */
@Component({
  selector: 'app-booking-progress',
  imports: [NgClass],
  templateUrl: './booking-progress.html',
  styleUrl: './booking-progress.css',
})
export class BookingProgress {
  /** Which step is currently active (1-indexed). */
  readonly currentStep = input<number>(1);

  /**
   * Optional: marks a specific step as failed (error state).
   * Default 0 = no failed step. Only PaymentFailed page uses this.
   */
  readonly failedStep = input<number>(0);

  /** Ordered list of all booking flow steps. */
  readonly steps = [
    { number: 1, label: 'Appointment' },
    { number: 2, label: 'Booking Details' },
    { number: 3, label: 'Payment' },
    { number: 4, label: 'Confirmation' },
  ];
}
