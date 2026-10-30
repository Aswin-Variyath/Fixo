import { Component, computed, input, output } from '@angular/core';
import { KycStepMeta, KycStepNumber } from '../../kyc.types';

@Component({
  selector: 'app-kyc-progress',
  imports: [],
  templateUrl: './kyc-progress.html',
  styleUrl: './kyc-progress.css',
})
export class KycProgress {
  readonly currentStep = input<KycStepNumber>(1);
  readonly stepChange = output<KycStepNumber>();

  readonly steps: KycStepMeta[] = [
    {
      number: 1,
      title: 'Aadhaar Verification',
      subLabel: 'Step 01',
      icon: 'badge',
    },
    {
      number: 2,
      title: 'Selfie Verification',
      subLabel: 'Step 02',
      icon: 'photo_camera',
    },
    {
      number: 3,
      title: 'Bank Details',
      subLabel: 'Step 03',
      icon: 'account_balance',
    },
    {
      number: 4,
      title: 'Review & Submit',
      subLabel: 'Step 04',
      icon: 'verified_user',
    },
  ];

  readonly currentStepTitle = computed(() => {
    const active = this.steps.find((s) => s.number === this.currentStep());
    return active ? active.title : 'Aadhaar Verification';
  });

  readonly mobileProgressWidth = computed(() => {
    const step = this.currentStep();
    return `${(step / this.steps.length) * 100}%`;
  });

  readonly desktopLineWidth = computed(() => {
    const step = this.currentStep();
    if (step <= 1) return '0%';
    if (step === 2) return '33%';
    if (step === 3) return '66%';
    return '100%';
  });

  onStepClick(stepNumber: KycStepNumber): void {
    this.stepChange.emit(stepNumber);
  }
}
