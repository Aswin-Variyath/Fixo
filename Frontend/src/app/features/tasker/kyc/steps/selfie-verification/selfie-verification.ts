import { Component, output, signal } from '@angular/core';
import { SelfieCameraState } from '../../kyc.types';

@Component({
  selector: 'app-selfie-verification',
  imports: [],
  templateUrl: './selfie-verification.html',
  styleUrl: './selfie-verification.css',
})
export class SelfieVerification {
  readonly back = output<void>();
  readonly continue = output<void>();

  readonly cameraState = signal<SelfieCameraState>('live');
  readonly isFlipped = signal<boolean>(false);
  readonly isFlashing = signal<boolean>(false);

  // Toast
  readonly toastMessage = signal<string | null>(null);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  setCameraState(state: SelfieCameraState): void {
    this.cameraState.set(state);
  }

  toggleCameraLens(): void {
    this.isFlipped.update((v) => !v);
    this.triggerToast(
      this.isFlipped()
        ? 'Switched to Rear Camera'
        : 'Switched to Front Camera'
    );
  }

  captureSelfie(): void {
    // Flash animation simulation
    this.isFlashing.set(true);
    setTimeout(() => {
      this.isFlashing.set(false);
      this.cameraState.set('captured');
      this.triggerToast('Selfie frame recorded! Review image before confirming.');
    }, 200);
  }

  confirmSelfie(): void {
    this.cameraState.set('confirmed');
    this.triggerToast('Selfie confirmed! You can now proceed to Step 3.');
  }

  triggerToast(message: string): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastMessage.set(message);
    this.toastTimer = setTimeout(() => {
      this.toastMessage.set(null);
    }, 3200);
  }

  onBack(): void {
    this.back.emit();
  }

  onContinue(): void {
    if (this.cameraState() === 'confirmed') {
      this.continue.emit();
    }
  }
}
