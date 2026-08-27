import { Component, signal } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { BookingProgress } from '../shared/booking-progress/booking-progress';
import { PaymentPlanSection } from './sections/payment-plan/payment-plan';
import { PaymentMethodSection } from './sections/payment-method/payment-method';
import { PaymentSummary } from './sections/payment-summary/payment-summary';
import { PolicyModal } from './sections/policy-modal/policy-modal';
import { Footer } from '../../../../shared/components/footer/footer';

@Component({
  selector: 'app-payment',
  imports: [
    Navbar,
    BookingProgress,
    PaymentPlanSection,
    PaymentMethodSection,
    PaymentSummary,
    PolicyModal,
    Footer,
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment {
  /** Controls visibility of the policy review modal overlay */
  readonly isPolicyModalOpen = signal<boolean>(false);

  /** Opens the policy modal overlay */
  openPolicyModal(): void {
    this.isPolicyModalOpen.set(true);
  }

  /** Closes the policy modal overlay */
  closePolicyModal(): void {
    this.isPolicyModalOpen.set(false);
  }
}
