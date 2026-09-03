import { Component, ViewEncapsulation } from '@angular/core';
import { ProfileHeader } from './sections/profile-header/profile-header';
import { AboutTasker } from './sections/about-tasker/about-tasker';
import { Services } from './sections/services/services';
import { Reviews } from './sections/reviews/reviews';
import { BookingCard } from './sections/booking-card/booking-card';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-tasker-profile',
  imports: [ProfileHeader, AboutTasker, Services, Reviews, BookingCard, Navbar, Footer],
  templateUrl: './tasker-profile.html',
  styleUrl: './tasker-profile.css',
  encapsulation: ViewEncapsulation.None,
})
export class TaskerProfile {}
