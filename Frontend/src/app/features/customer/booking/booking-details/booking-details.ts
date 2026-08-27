import { Component } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { BookingProgress } from '../shared/booking-progress/booking-progress';
import { CustomerDetailsSection } from './sections/customer-details/customer-details';
import { ServiceAddressSection } from './sections/service-address/service-address';
import { AdditionalNotesSection } from './sections/additional-notes/additional-notes';
import { PhotoUploadSection } from './sections/photo-upload/photo-upload';
import { BookingDetailsSummary } from './sections/booking-details-summary/booking-details-summary';
import { Footer } from '../../../../shared/components/footer/footer';

@Component({
  selector: 'app-booking-details',
  imports: [
    Navbar,
    BookingProgress,
    CustomerDetailsSection,
    ServiceAddressSection,
    AdditionalNotesSection,
    PhotoUploadSection,
    BookingDetailsSummary,
    Footer
  ],
  templateUrl: './booking-details.html',
  styleUrl: './booking-details.css',
})
export class BookingDetails {}
