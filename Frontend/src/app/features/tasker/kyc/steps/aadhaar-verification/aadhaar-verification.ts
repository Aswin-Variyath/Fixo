import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-aadhaar-verification',
  imports: [],
  templateUrl: './aadhaar-verification.html',
  styleUrl: './aadhaar-verification.css',
})
export class AadhaarVerification {
  readonly continue = output<void>();

  // Mock OCR field signals
  readonly fullName = signal('Ramesh Kumar');
  readonly maskedAadhaar = signal('XXXX XXXX 8942');
  readonly dob = signal('14 / 08 / 1989');
  readonly gender = signal('Male');
  readonly pincode = signal('673001');
  readonly address = signal('123 Beach Road, Vellayil, Kozhikode, Kerala');

  // Toast message
  readonly toastMessage = signal<string | null>(null);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  triggerToast(message: string): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastMessage.set(message);
    this.toastTimer = setTimeout(() => {
      this.toastMessage.set(null);
    }, 3200);
  }

  onContinue(): void {
    this.continue.emit();
  }
}
