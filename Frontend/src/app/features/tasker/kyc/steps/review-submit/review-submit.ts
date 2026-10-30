import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { KycStepNumber } from '../../kyc.types';

@Component({
  selector: 'app-review-submit',
  standalone: true,
  templateUrl: './review-submit.html',
  styleUrl: './review-submit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewSubmit {
  readonly back = output<void>();
  readonly editStep = output<KycStepNumber>();
  readonly restart = output<void>();
  readonly submit = output<void>();

  readonly isSubmitted = signal(false);

  onBack(): void {
    this.back.emit();
  }

  onEditStep(step: KycStepNumber): void {
    this.editStep.emit(step);
  }

  onRestart(): void {
    this.isSubmitted.set(false);
    this.restart.emit();
  }

  onSubmit(): void {
    this.isSubmitted.set(true);
    this.submit.emit();
  }
}
