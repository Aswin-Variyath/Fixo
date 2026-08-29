import { Component, input } from '@angular/core';

export interface FindJobItem {
  id: string;
  service: string;
  customer: string;
  date: string;
  time: string;
  duration: string;
  distance: string;
  location: string;
  amount: string;
  description: string;
}

@Component({ selector: 'app-find-job-card', imports: [], templateUrl: './find-job-card.html', styleUrl: './find-job-card.css' })
export class FindJobCard {
  readonly job = input.required<FindJobItem>();
}
