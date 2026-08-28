import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-tasker-availability-card',
  imports: [],
  templateUrl: './tasker-availability-card.html',
  styleUrl: './tasker-availability-card.css',
})
export class TaskerAvailabilityCard {
  readonly isKycVerified = input<boolean>(false);
  readonly isOnline = signal<boolean>(true);

  toggleOnline(): void {
    if (this.isKycVerified()) {
      this.isOnline.update((v) => !v);
    }
  }
}
