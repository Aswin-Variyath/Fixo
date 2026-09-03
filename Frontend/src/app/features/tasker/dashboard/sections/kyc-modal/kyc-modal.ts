import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-kyc-modal',
  imports: [],
  templateUrl: './kyc-modal.html',
  styleUrl: './kyc-modal.css',
})
export class KycModal {
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
