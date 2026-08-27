import { Component, signal } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Footer } from '../../../../shared/components/footer/footer';
import { BookingProgress } from '../shared/booking-progress/booking-progress';
import { PolicyModal } from '../payment/sections/policy-modal/policy-modal';
import { PaymentFailedHeader } from './sections/payment-failed-header/payment-failed-header';
import { PaymentFailedBookingDetails } from './sections/payment-failed-booking-details/payment-failed-booking-details';
import { PaymentFailedSummary } from './sections/payment-failed-summary/payment-failed-summary';
import { PaymentFailedActions } from './sections/payment-failed-actions/payment-failed-actions';

@Component({
  selector: 'app-payment-failed',
  imports: [
    Navbar,
    Footer,
    BookingProgress,
    PolicyModal,
    PaymentFailedHeader,
    PaymentFailedBookingDetails,
    PaymentFailedSummary,
    PaymentFailedActions,
  ],
  templateUrl: './payment-failed.html',
  styleUrl: './payment-failed.css',
})
export class PaymentFailed {
  /** Controls the visibility of the Policy Modal overlay. */
  readonly isPolicyModalOpen = signal<boolean>(false);

  /** Opens the Policy Modal when the user clicks "Retry Payment". */
  openPolicyModal(): void {
    this.isPolicyModalOpen.set(true);
  }

  /**
   * Closes the Policy Modal (triggered by the modal's closeModal output
   * or by the Cancel button inside the modal).
   */
  closePolicyModal(): void {
    this.isPolicyModalOpen.set(false);
  }

  /**
   * Mock handler for when the user agrees to the policy and confirms retry.
   * Does NOT perform real payment processing — visual phase only.
   */
  onPolicyConfirmed(): void {
    // Static/mock: no payment API call, no navigation change.
    // Real payment retry logic to be wired in a future step.
  }
}
