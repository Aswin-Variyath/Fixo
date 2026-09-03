import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { JobSearchFilters } from './sections/job-search-filters/job-search-filters';
import { FindJobCard, FindJobItem } from './sections/find-job-card/find-job-card';

@Component({
  selector: 'app-find-jobs',
  imports: [Navbar, Footer, JobSearchFilters, FindJobCard],
  templateUrl: './find-jobs.html',
  styleUrl: './find-jobs.css',
})
export class FindJobs {
  readonly jobs: FindJobItem[] = [
    { id: 'find-1', service: 'Electrical Wiring', customer: 'Rahul Nair', date: 'Aug 28, 2026', time: '10:00 AM', duration: '3 hrs', distance: '2.4 km away', location: 'Kozhikode, Kerala', amount: '₹1,200', description: 'Install electrical wiring for a residential property.' },
    { id: 'find-2', service: 'Plumbing Repair', customer: 'Sneha Patel', date: 'Aug 29, 2026', time: '02:00 PM', duration: '1.5 hrs', distance: '3.1 km away', location: 'Kozhikode, Kerala', amount: '₹800', description: 'Fix leaking pipe under the kitchen sink.' },
    { id: 'find-3', service: 'AC Service', customer: 'Anand Menon', date: 'Sep 01, 2026', time: '09:30 AM', duration: '2 hrs', distance: '5.0 km away', location: 'Kozhikode, Kerala', amount: '₹1,500', description: 'General maintenance and filter cleaning for two split AC units.' },
    { id: 'find-4', service: 'Fan Installation', customer: 'Meera Krishnan', date: 'Aug 30, 2026', time: '11:00 AM', duration: '1 hr', distance: '1.2 km away', location: 'Kozhikode, Kerala', amount: '₹600', description: 'Install new ceiling fan in the living room. Wiring is ready.' },
  ];
}
