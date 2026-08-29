import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { UpcomingJobHeader } from './sections/upcoming-job-header/upcoming-job-header';
import { CustomerServiceCard } from './sections/customer-service-card/customer-service-card';
import { JobScheduleCard } from './sections/job-schedule-card/job-schedule-card';
import { JobLocationCard } from './sections/job-location-card/job-location-card';
import { CustomerRequestCard } from './sections/customer-request-card/customer-request-card';
import { EarningsSummaryCard } from './sections/earnings-summary-card/earnings-summary-card';
import { JobActionsCard } from './sections/job-actions-card/job-actions-card';
import { BookingSummaryCard } from './sections/booking-summary-card/booking-summary-card';

@Component({
  selector: 'app-upcoming-job-details',
  imports: [
    Navbar,
    Footer,
    UpcomingJobHeader,
    CustomerServiceCard,
    JobScheduleCard,
    JobLocationCard,
    CustomerRequestCard,
    EarningsSummaryCard,
    JobActionsCard,
    BookingSummaryCard,
  ],
  templateUrl: './upcoming-job-details.html',
  styleUrl: './upcoming-job-details.css',
})
export class UpcomingJobDetails {}
