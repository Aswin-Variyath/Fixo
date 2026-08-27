import { Component, output } from '@angular/core';

@Component({
  selector: 'app-payment-failed-actions',
  imports: [],
  templateUrl: './payment-failed-actions.html',
  styleUrl: './payment-failed-actions.css',
})
export class PaymentFailedActions {
  /** Emitted when the user clicks "Retry Payment" — parent opens the PolicyModal. */
  readonly retryPayment = output<void>();
}
