import { Component, inject, OnInit, signal } from '@angular/core';

import { Footer } from '../../../shared/components/footer/footer';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Filters } from './sections/filters/filters';
import { TaskerResults } from './sections/tasker-results/tasker-results';
import { DiscoveryHeader } from './sections/discovery-header/discovery-header';
import { DiscoveryLocation } from './services/discovery-location';
import { DiscoveryLocationApi } from './api/discovery-location-api';
import { TaskerSearch } from './services/tasker-search';
import { TaskerSearchApi } from './api/tasker-search-api';

import { LocationModal } from '../location/components/location-modal/location-modal';
import { LocationContextService } from '../location/services/location-context-service';
import { SelectedLocation } from '../location/types/location.types';

@Component({
  selector: 'app-discovery',
  imports: [
    Footer,
    Navbar,
    Filters,
    TaskerResults,
    DiscoveryHeader,
    LocationModal,
  ],
  providers: [
    DiscoveryLocation,
    DiscoveryLocationApi,
    TaskerSearch,
    TaskerSearchApi,
  ],
  templateUrl: './discovery.html',
  styleUrl: './discovery.css',
})
export class Discovery implements OnInit {
  private readonly taskerSearch = inject(TaskerSearch);
  private readonly locationContext = inject(LocationContextService);

  readonly showLocationModal = signal(false);

  ngOnInit(): void {
    const location = this.locationContext.location();

    if (location) {
      this.searchTaskers(location);
    } else {
      this.showLocationModal.set(true);
    }
  }

  onLocationSelected(location: SelectedLocation): void {
    this.showLocationModal.set(false);
    this.searchTaskers(location);
  }

  closeLocationModal(): void {
    this.showLocationModal.set(false);
  }

  private searchTaskers(location: SelectedLocation): void {
    this.taskerSearch.search({
      latitude: location.latitude,
      longitude: location.longitude,
      ...(location.addressId
        ? { addressId: location.addressId }
        : {}),
      distance: 5,
      sortBy: 'recommended',
      page: 1,
    });
  }
}