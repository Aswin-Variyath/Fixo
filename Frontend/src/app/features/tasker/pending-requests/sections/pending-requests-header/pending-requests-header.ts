import { Component, input } from '@angular/core';

@Component({
  selector: 'app-pending-requests-header',
  imports: [],
  templateUrl: './pending-requests-header.html',
  styleUrl: './pending-requests-header.css',
})
export class PendingRequestsHeader {
  readonly count = input<number>(5);
}
