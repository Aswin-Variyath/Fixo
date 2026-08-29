import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { ServiceDetails } from './sections/service-details/service-details';
import { ScheduleLocation } from './sections/schedule-location/schedule-location';
import { JobDescription } from './sections/job-description/job-description';
import { CustomerCard } from './sections/customer-card/customer-card';
import { EstimatedEarnings } from './sections/estimated-earnings/estimated-earnings';
import { RequestInfo } from './sections/request-info/request-info';
import { ActionArea } from './sections/action-area/action-area';

@Component({
  selector: 'app-pending-request-details',
  imports: [
    RouterLink,
    Navbar,
    Footer,
    ServiceDetails,
    ScheduleLocation,
    JobDescription,
    CustomerCard,
    EstimatedEarnings,
    RequestInfo,
    ActionArea,
  ],
  templateUrl: './pending-request-details.html',
  styleUrl: './pending-request-details.css',
})
export class PendingRequestDetails {}
