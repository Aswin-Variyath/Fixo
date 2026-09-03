import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-policy-modal',
  imports: [],
  templateUrl: './policy-modal.html',
  styleUrl: './policy-modal.css',
})
export class PolicyModal {
  /** Controls whether the policy modal overlay is visible. */
  readonly isOpen = input<boolean>(false);

  /** Emitted when user cancels or closes the modal. */
  readonly closeModal = output<void>();

  /** Emitted when user agrees to policy and confirms. */
  readonly confirmed = output<void>();

  /** Agreement checkbox state inside the modal. */
  readonly isAgreed = signal<boolean>(false);

  /** Updates the agreement checkbox state. */
  toggleAgreement(checked: boolean): void {
    this.isAgreed.set(checked);
  }

  /** Closes the modal and resets the agreement checkbox. */
  close(): void {
    this.isAgreed.set(false);
    this.closeModal.emit();
  }

  /** Handles policy confirmation and closes the modal. */
  confirm(): void {
    if (!this.isAgreed()) return;
    this.close();
    this.confirmed.emit();
  }
}
