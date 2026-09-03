import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-availability-card',
  imports: [],
  templateUrl: './availability-card.html',
  styleUrl: './availability-card.css',
})
export class AvailabilityCard {
  readonly isKycVerified = input<boolean>(false);
  readonly isOnline = signal<boolean>(true);

  toggleOnline(): void {
    if (this.isKycVerified()) {
      this.isOnline.update((v) => !v);
    }
  }
}
