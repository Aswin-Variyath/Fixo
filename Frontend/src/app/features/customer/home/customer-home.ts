import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { WhyChoodeFixo } from './sections/why-choode-fixo/why-choode-fixo';
import { Services } from './sections/services/services';
import { NearbyTaskers } from './sections/nearby-taskers/nearby-taskers';
import { Hero } from './sections/hero/hero';
import { BecomeATasker } from './sections/become-a-tasker/become-a-tasker';

@Component({
  selector: 'app-customer-home',
  imports: [Navbar,Footer,WhyChoodeFixo, Services, NearbyTaskers, Hero, BecomeATasker],
  templateUrl: './customer-home.html',
  styleUrl: './customer-home.css',
})
export class CustomerHome {
}
