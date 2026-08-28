import { Component, signal } from '@angular/core';
import { Navbar } from '../../../../../shared/components/navbar/navbar';
import { Footer } from '../../../../../shared/components/footer/footer';
import { TaskerAvailabilityCard } from '../../components/tasker-availability-card/tasker-availability-card';
import { TaskerStatsGrid } from '../../components/tasker-stats-grid/tasker-stats-grid';
import { TaskerQuickActions } from '../../components/tasker-quick-actions/tasker-quick-actions';
import { TaskerProfileSetup } from '../../components/tasker-profile-setup/tasker-profile-setup';
import { TaskerVisibilityBanner } from '../../components/tasker-visibility-banner/tasker-visibility-banner';
import { TaskerKycModal } from '../../components/tasker-kyc-modal/tasker-kyc-modal';

@Component({
  selector: 'app-tasker-dashboard',
  imports: [
    Navbar,
    Footer,
    TaskerAvailabilityCard,
    TaskerStatsGrid,
    TaskerQuickActions,
    TaskerProfileSetup,
    TaskerVisibilityBanner,
    TaskerKycModal,
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
