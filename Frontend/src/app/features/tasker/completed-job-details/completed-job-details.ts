import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { CompletedJobHeader } from './sections/completed-job-header/completed-job-header';
import { CustomerServiceSummary } from './sections/customer-service-summary/customer-service-summary';
import { CompletedJobInformation } from './sections/completed-job-information/completed-job-information';
import { CustomerReview } from './sections/customer-review/customer-review';
import { PaymentSummary } from './sections/payment-summary/payment-summary';

@Component({
  selector: 'app-completed-job-details',
  imports: [
    RouterLink,
    Navbar,
    Footer,
    CompletedJobHeader,
    CustomerServiceSummary,
    CompletedJobInformation,
    CustomerReview,
    PaymentSummary,
  ],
  templateUrl: './completed-job-details.html',
  styleUrl: './completed-job-details.css',
})
export class CompletedJobDetails {}
