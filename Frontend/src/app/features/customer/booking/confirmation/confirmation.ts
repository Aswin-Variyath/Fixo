import { Component } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Footer } from '../../../../shared/components/footer/footer';
import { BookingProgress } from '../shared/booking-progress/booking-progress';
import { ConfirmationHeader } from './sections/confirmation-header/confirmation-header';
import { ConfirmationDetails } from './sections/confirmation-details/confirmation-details';
import { ConfirmationPaymentSummary } from './sections/confirmation-payment-summary/confirmation-payment-summary';
import { ConfirmationActions } from './sections/confirmation-actions/confirmation-actions';

@Component({
  selector: 'app-confirmation',
  imports: [
    Navbar,
    Footer,
    BookingProgress,
    ConfirmationHeader,
    ConfirmationDetails,
    ConfirmationPaymentSummary,
    ConfirmationActions,
  ],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class Confirmation {}
