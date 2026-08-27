import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

/*
 * BookingProgress
 * ---------------
 * Shared progress indicator for the multi-step booking flow.
 *
 * Usage:
 *   <app-booking-progress [currentStep]="1" />   ← Appointment page
 *   <app-booking-progress [currentStep]="2" />   ← Booking Details page
 *   <app-booking-progress [currentStep]="3" />   ← Payment page
 *   <app-booking-progress [currentStep]="4" />   ← Confirmation page
 *
 * Step state logic:
 *   stepNumber < currentStep  → completed  (check icon, primary colours)
 *   stepNumber === currentStep → active    (number, primary colours, bold label)
 *   stepNumber > currentStep  → inactive  (number, surface-variant colours)
 *
 * Connector state logic:
 *   connector after step N:  if N < currentStep → bg-primary/50 (completed)
 *                            else               → bg-glass-stroke (upcoming)
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

  /** Ordered list of all booking flow steps. */
  readonly steps = [
    { number: 1, label: 'Appointment' },
    { number: 2, label: 'Booking Details' },
    { number: 3, label: 'Payment' },
    { number: 4, label: 'Confirmation' },
  ];
}
