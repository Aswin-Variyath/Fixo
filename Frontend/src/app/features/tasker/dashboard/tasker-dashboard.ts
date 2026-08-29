import { Component, signal } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { AvailabilityCard } from './sections/availability-card/availability-card';
import { StatsGrid } from './sections/stats-grid/stats-grid';
import { QuickActions } from './sections/quick-actions/quick-actions';
import { ProfileSetup } from './sections/profile-setup/profile-setup';
import { VisibilityBanner } from './sections/visibility-banner/visibility-banner';
import { KycModal } from './sections/kyc-modal/kyc-modal';

@Component({
  selector: 'app-tasker-dashboard',
  imports: [
    Navbar,
    Footer,
    AvailabilityCard,
    StatsGrid,
    QuickActions,
    ProfileSetup,
    VisibilityBanner,
    KycModal,
  ],
  templateUrl: './tasker-dashboard.html',
  styleUrl: './tasker-dashboard.css',
})
export class TaskerDashboard {
  readonly isKycVerified = signal(false);
  readonly isKycModalOpen = signal(false);

  openKycModal(): void {
    this.isKycModalOpen.set(true);
  }

  closeKycModal(): void {
    this.isKycModalOpen.set(false);
  }

  toggleKycState(): void {
    this.isKycVerified.update((v) => !v);
  }
}
