import { Component, inject, OnInit, signal } from '@angular/core';

import { Footer } from '../../../shared/components/footer/footer';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { DiscoveryFilters, Filters } from './sections/filters/filters';
import { TaskerResults } from './sections/tasker-results/tasker-results';
import { DiscoveryHeader } from './sections/discovery-header/discovery-header';
import { DiscoveryLocation } from './services/discovery-location';
import { DiscoveryLocationApi } from './api/discovery-location-api';
import { TaskerSearch } from './services/tasker-search';
import { TaskerSearchApi } from './api/tasker-search-api';

import { LocationModal } from '../location/components/location-modal/location-modal';
import { LocationContextService } from '../location/services/location-context-service';
import { SelectedLocation } from '../location/types/location.types';
import { TaskerAvailabilityFilter, TaskerSearchSort } from './types/tasker-search';

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
  readonly emptyState = this.taskerSearch.emptyState;
  private rating: number | undefined;
  private minHourlyRate: number | undefined;
private maxHourlyRate: number | undefined;
private sortBy: TaskerSearchSort = 'recommended';
  readonly showLocationModal = signal(false);
  readonly appliedFilters = signal<DiscoveryFilters>({
    distance:2,
    availabilityFilter:undefined,
  })
  private selectedLocation: SelectedLocation | null = null;

  private distance = 2

  private availabilityFilter: | TaskerAvailabilityFilter | undefined

  ngOnInit(): void {
    const location = this.locationContext.location();

    if (location) {
      this.selectedLocation = location
      this.searchTaskers(location);
    } else {
      this.showLocationModal.set(true);
    }
  }

  onLocationSelected(location: SelectedLocation): void {
    this.showLocationModal.set(false);
    this.selectedLocation = location;
    this.searchTaskers(location);
  }

  onSortChange(sortBy:TaskerSearchSort):void {
    this.sortBy = sortBy
    if(this.selectedLocation) {
      this.searchTaskers(this.selectedLocation)
    }
  }

  onFiltersChange(filters:DiscoveryFilters):void {
    this.distance = filters.distance
    this.rating = filters.rating;
    this.minHourlyRate = filters.minHourlyRate;
  this.maxHourlyRate = filters.maxHourlyRate;
  this.availabilityFilter = filters.availabilityFilter;
    this.appliedFilters.set(filters)
    if(this.selectedLocation) {
      this.searchTaskers(this.selectedLocation)
    }
  }

  removeDistanceFilter(): void {
  this.distance = 2;

  this.appliedFilters.update((filters) => ({
    ...filters,
    distance: 2,
  }));

  if (this.selectedLocation) {
    this.searchTaskers(this.selectedLocation);
  }
}

removeAvailabilityFilter(): void {
  this.availabilityFilter = undefined;

  this.appliedFilters.update((filters) => ({
    ...filters,
    availabilityFilter: undefined,
  }));

  if (this.selectedLocation) {
    this.searchTaskers(this.selectedLocation);
  }
}

  onAvailabilityChange(
    availabilityFilter: TaskerAvailabilityFilter | undefined
  ): void {
    this.availabilityFilter = availabilityFilter;

    if (this.selectedLocation) {
      this.searchTaskers(this.selectedLocation);
    }
  }

  closeLocationModal(): void {
    this.showLocationModal.set(false);
  }

  removeRatingFilter():void {
    this.rating = undefined
    this.appliedFilters.update((filter)=>({
      ...filter,
      rating:undefined
    }))
    if(this.selectedLocation) this.searchTaskers(this.selectedLocation)
  }

  onPriceRemove(): void {
  this.appliedFilters.update((filters) => ({
    ...filters,
    minHourlyRate: undefined,
    maxHourlyRate: undefined,
  }));

  this.minHourlyRate = undefined;
  this.maxHourlyRate = undefined;

  if (this.selectedLocation) {
    this.searchTaskers(this.selectedLocation);
  }
}

  private searchTaskers(location: SelectedLocation): void {
    this.taskerSearch.search({
      latitude: location.latitude,
      longitude: location.longitude,
      ...(location.addressId
        ? { addressId: location.addressId }
        : {}),
      distance: this.distance,
      rating: this.rating,
      minHourlyRate: this.minHourlyRate,
  maxHourlyRate: this.maxHourlyRate,
      sortBy: this.sortBy,
      availabilityFilter: this.availabilityFilter,
      page: 1,
    });
  }
}