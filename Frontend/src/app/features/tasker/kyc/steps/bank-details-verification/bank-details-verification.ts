import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { BankFormState } from '../../kyc.types';

@Component({
  selector: 'app-bank-details-verification',
  standalone: true,
  templateUrl: './bank-details-verification.html',
  styleUrl: './bank-details-verification.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankDetailsVerification {
  readonly back = output<void>();
  readonly continue = output<void>();

  readonly bankState = signal<BankFormState>('validated');

  readonly accountHolder = signal('Ramesh Kumar');
  readonly bankName = signal('State Bank of India');
  readonly accountNumber = signal('309811225689');
  readonly confirmAccountNumber = signal('309811225689');
  readonly showAccNum = signal(false);
  readonly showConfirmAccNum = signal(false);
  readonly ifscCode = signal('SBIN0008421');
  readonly branchName = signal('Kozhikode Main Branch, Mavoor Road');

  readonly toastMessage = signal<string | null>(null);

  readonly accountNumbersMatch = computed(() => {
    const acc = this.accountNumber().trim();
    const confirm = this.confirmAccountNumber().trim();
    return acc.length >= 9 && acc === confirm;
  });

  setKycState(state: BankFormState): void {
    this.bankState.set(state);

    if (state === 'empty') {
      this.accountHolder.set('Ramesh Kumar');
      this.bankName.set('');
      this.accountNumber.set('');
      this.confirmAccountNumber.set('');
      this.ifscCode.set('');
      this.branchName.set('');
      this.showToast('Reset to empty state');
    } else if (state === 'uploaded') {
      this.accountHolder.set('Ramesh Kumar');
      this.bankName.set('State Bank of India');
      this.accountNumber.set('309811225689');
      this.confirmAccountNumber.set('309811225689');
      this.ifscCode.set('SBIN0008421');
      this.branchName.set('Kozhikode Main Branch, Mavoor Road');
      this.showToast('Passbook document uploaded');
    } else if (state === 'validated') {
      this.accountHolder.set('Ramesh Kumar');
      this.bankName.set('State Bank of India');
      this.accountNumber.set('309811225689');
      this.confirmAccountNumber.set('309811225689');
      this.ifscCode.set('SBIN0008421');
      this.branchName.set('Kozhikode Main Branch, Mavoor Road');
      this.showToast('All bank account details validated');
    } else if (state === 'mismatch') {
      this.accountHolder.set('Suresh Kumar Electricals');
      this.bankName.set('State Bank of India');
      this.accountNumber.set('309811225689');
      this.confirmAccountNumber.set('309811225689');
      this.ifscCode.set('SBIN0008421');
      this.branchName.set('Kozhikode Main Branch, Mavoor Road');
      this.showToast('Name mismatch alert active');
    }
  }

  triggerPassbookUpload(): void {
    this.bankState.set('uploaded');
    this.showToast('Passbook front page selected and verified (640 KB)');
  }

  saveDraft(): void {
    this.showToast('Progress saved as draft');
  }

  onBack(): void {
    this.back.emit();
  }

  onContinue(): void {
    if (this.bankState() === 'empty' || this.bankState() === 'mismatch') {
      return;
    }
    this.continue.emit();
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      if (this.toastMessage() === msg) {
        this.toastMessage.set(null);
      }
    }, 3000);
  }
}
