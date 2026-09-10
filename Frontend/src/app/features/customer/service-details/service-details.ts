import { Component } from '@angular/core';
import { Footer } from '../../../shared/components/footer/footer';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { LocationContext } from './sections/location-context/location-context';
import { RecommendedTaskers } from './sections/recommended-taskers/recommended-taskers';
import { ServiceOverview } from './sections/service-overview/service-overview';

@Component({
  selector: 'app-service-details',
  imports: [
    Footer,
    LocationContext,
    Navbar,
    RecommendedTaskers,
    ServiceOverview,
  ],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css',
})
export class ServiceDetails {}
