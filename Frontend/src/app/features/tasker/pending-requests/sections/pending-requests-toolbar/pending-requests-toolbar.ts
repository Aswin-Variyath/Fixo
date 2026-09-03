import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-pending-requests-toolbar',
  imports: [],
  templateUrl: './pending-requests-toolbar.html',
  styleUrl: './pending-requests-toolbar.css',
})
export class PendingRequestsToolbar {
  readonly activeFilter = signal<'all' | 'today' | 'tomorrow' | 'this_week'>('all');

  setFilter(filter: 'all' | 'today' | 'tomorrow' | 'this_week'): void {
    this.activeFilter.set(filter);
  }
}
