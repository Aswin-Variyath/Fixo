import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-tasker-kyc-modal',
  imports: [],
  templateUrl: './tasker-kyc-modal.html',
  styleUrl: './tasker-kyc-modal.css',
})
export class TaskerKycModal {
  readonly isOpen = input<boolean>(false);
  readonly close = output<void>();

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }
}
