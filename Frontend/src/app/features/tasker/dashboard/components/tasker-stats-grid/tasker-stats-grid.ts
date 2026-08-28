import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tasker-stats-grid',
  imports: [],
  templateUrl: './tasker-stats-grid.html',
  styleUrl: './tasker-stats-grid.css',
})
export class TaskerStatsGrid {
  readonly isKycVerified = input<boolean>(false);
}
