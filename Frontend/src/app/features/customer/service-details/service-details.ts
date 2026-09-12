import { Component, inject, OnInit, signal } from '@angular/core';
import { Footer } from '../../../shared/components/footer/footer';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { LocationContext } from './sections/location-context/location-context';
import { RecommendedTaskers } from './sections/recommended-taskers/recommended-taskers';
import { ServiceOverview } from './sections/service-overview/service-overview';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../home/services/service.service';
import { ServiceDetailsData } from '../home/services/service.types';
import { ServiceApi } from '../home/services/service-api';
import { ServiceStore } from '../home/services/service.store';

@Component({
  selector: 'app-service-details',
  imports: [
    Footer,
    LocationContext,
    Navbar,
    RecommendedTaskers,
    ServiceOverview,
  ],
   providers: [
    ServiceApi,
    ServiceService,
    ServiceStore,
  ],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css',
})
export class ServiceDetails implements OnInit{
  private readonly route = inject(ActivatedRoute)
  private readonly serviceService = inject(ServiceService)

  serviceId: string = ''
  
  // 2. Change this from a plain property to a Writable Signal
  service = signal<ServiceDetailsData | null>(null);

  ngOnInit(): void {
    const serviceId = this.route.snapshot.paramMap.get('serviceId')
    if (!serviceId) return
    this.serviceId = serviceId

    this.serviceService.getServiceById(serviceId).subscribe({
      next: (response) => {
        console.log('Service details response:', response);
        
        // 3. Update the signal value using the .set() method
        this.service.set(response.data);
        
        console.log('Service details data set in signal!');
      },
      error: (error) => {
        console.error("Failed to load service details", error)
      }
    })
  }
}
