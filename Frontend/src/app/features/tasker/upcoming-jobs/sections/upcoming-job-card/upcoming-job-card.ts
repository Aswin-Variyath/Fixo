import { Component, input } from '@angular/core';

export interface UpcomingJobItem {
  id: string;
  serviceTitle: string;
  serviceIcon: string;
  status: string;
  date: string;
  time: string;
  duration: string;
  customerName: string;
  customerAvatar: string;
  location: string;
  estimatedEarnings: string;
}

@Component({
  selector: 'app-upcoming-job-card',
  imports: [],
  templateUrl: './upcoming-job-card.html',
  styleUrl: './upcoming-job-card.css',
})
export class UpcomingJobCard {
  readonly job = input.required<UpcomingJobItem>();
}
