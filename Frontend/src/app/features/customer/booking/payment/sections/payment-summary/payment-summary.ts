import { Component, output } from '@angular/core';

@Component({
  selector: 'app-payment-summary',
  imports: [],
  templateUrl: './payment-summary.html',
  styleUrl: './payment-summary.css',
})
export class PaymentSummary {
  /** Emits when user clicks the main payment CTA to review policy and proceed. */
  readonly openPolicyModal = output<void>();
}
