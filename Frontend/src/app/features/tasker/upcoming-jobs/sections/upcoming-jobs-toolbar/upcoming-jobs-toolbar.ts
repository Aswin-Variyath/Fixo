import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-upcoming-jobs-toolbar',
  imports: [],
  templateUrl: './upcoming-jobs-toolbar.html',
  styleUrl: './upcoming-jobs-toolbar.css',
})
export class UpcomingJobsToolbar {
  readonly activeFilter = signal<string>('All');
  readonly filters = ['All', 'Today', 'Tomorrow', 'This Week'];

  selectFilter(filter: string): void {
    this.activeFilter.set(filter);
  }
}
