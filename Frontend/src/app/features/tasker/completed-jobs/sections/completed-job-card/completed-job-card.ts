import { Component, input } from '@angular/core';

export interface CompletedJobItem {
  id: string;
  serviceTitle: string;
  customerName: string;
  date: string;
  amount: string;
  customerAvatar: string;
}

@Component({
  selector: 'app-completed-job-card',
  imports: [],
  templateUrl: './completed-job-card.html',
  styleUrl: './completed-job-card.css',
})
export class CompletedJobCard {
  readonly job = input.required<CompletedJobItem>();
}
