import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stats-grid',
  imports: [],
  templateUrl: './stats-grid.html',
  styleUrl: './stats-grid.css',
})
export class StatsGrid {
  readonly isKycVerified = input<boolean>(false);
}
