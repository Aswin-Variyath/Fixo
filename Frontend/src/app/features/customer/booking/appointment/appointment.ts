import { Component } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { BookingProgress } from '../shared/booking-progress/booking-progress';
import { BookingTaskerSummary } from './sections/tasker-summary/tasker-summary';
import { ServiceSelector } from './sections/service-selector/service-selector';
import { DatePicker } from './sections/date-picker/date-picker';
import { TimeSlotSelector } from './sections/time-slot-selector/time-slot-selector';
import { DurationPicker } from './sections/duration-picker/duration-picker';
import { BookingSummary } from './sections/booking-summary/booking-summary';
import { Footer } from '../../../../shared/components/footer/footer';

@Component({
  selector: 'app-appointment',
  imports: [
    Navbar,
    BookingProgress,
    BookingTaskerSummary,
    ServiceSelector,
    DatePicker,
    TimeSlotSelector,
    DurationPicker,
    BookingSummary,
    Footer
  ],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css',
})
export class Appointment {}
