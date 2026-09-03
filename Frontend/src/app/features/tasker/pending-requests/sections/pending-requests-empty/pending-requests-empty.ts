import { Component, output } from '@angular/core';

@Component({
  selector: 'app-pending-requests-empty',
  imports: [],
  templateUrl: './pending-requests-empty.html',
  styleUrl: './pending-requests-empty.css',
})
export class PendingRequestsEmpty {
  readonly refresh = output<void>();

  onRefresh(): void {
    this.refresh.emit();
  }
}
