import { Component, signal } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { AvailabilityHeader } from './sections/availability-header/availability-header';
import { AvailabilitySchedule } from './sections/availability-schedule/availability-schedule';
import { KycRestrictedBanner } from './sections/kyc-restricted-banner/kyc-restricted-banner';

@Component({
  selector: 'app-availability',
  imports: [Navbar, Footer, AvailabilityHeader, AvailabilitySchedule, KycRestrictedBanner],
  templateUrl: './availability.html',
  styleUrl: './availability.css',
})
export class Availability {
  readonly isKycRestricted = signal(true);
}
