import { Component, input } from '@angular/core';

@Component({
  selector: 'app-quick-actions',
  imports: [],
  templateUrl: './quick-actions.html',
  styleUrl: './quick-actions.css',
})
export class QuickActions {
  readonly isKycVerified = input<boolean>(false);
}
