import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tasker-quick-actions',
  imports: [],
  templateUrl: './tasker-quick-actions.html',
  styleUrl: './tasker-quick-actions.css',
})
export class TaskerQuickActions {
  readonly isKycVerified = input<boolean>(false);
}
