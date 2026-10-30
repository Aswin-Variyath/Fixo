import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Footer } from '../../../shared/components/footer/footer';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { KycProgress } from './components/kyc-progress/kyc-progress';
import { KycStepNumber } from './kyc.types';
import { AadhaarVerification } from './steps/aadhaar-verification/aadhaar-verification';
import { BankDetailsVerification } from './steps/bank-details-verification/bank-details-verification';
import { ReviewSubmit } from './steps/review-submit/review-submit';
import { SelfieVerification } from './steps/selfie-verification/selfie-verification';

@Component({
  selector: 'app-kyc',
  standalone: true,
  imports: [
    Navbar,
    Footer,
    KycProgress,
    AadhaarVerification,
    SelfieVerification,
    BankDetailsVerification,
    ReviewSubmit,
  ],
  templateUrl: './kyc.html',
  styleUrl: './kyc.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Kyc implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly currentStep = signal<KycStepNumber>(1);

  ngOnInit(): void {
    // Read optional ?step=1..4 query parameter
    this.route.queryParamMap.subscribe((params) => {
      const stepParam = params.get('step');
      if (stepParam) {
        const stepNum = Number(stepParam);
        if (stepNum >= 1 && stepNum <= 4) {
          this.currentStep.set(stepNum as KycStepNumber);
        }
      }
    });
  }

  goToStep(step: KycStepNumber): void {
    this.currentStep.set(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update query param without reloading page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { step },
      queryParamsHandling: 'merge',
    });
  }
}
