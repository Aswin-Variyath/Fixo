import { Component, output } from '@angular/core';
import { TaskerAvailabilityFilter } from '../../types/tasker-search';

export interface DiscoveryFilters {
  distance: number;
  rating?: number;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  availabilityFilter?: TaskerAvailabilityFilter;
}

@Component({
  selector: 'app-filters',
  imports: [],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters {
  readonly filtersChange = output<DiscoveryFilters>();
  readonly availabilityChange =
    output<TaskerAvailabilityFilter | undefined>();

  selectedDistance = 2;
  selectedAvailability: TaskerAvailabilityFilter | undefined;
  selectedMinHourlyRate: number | undefined;
  selectedMaxHourlyRate: number | undefined;
  selectedRating: number | undefined;

  readonly minPrice = 200;
  readonly maxPrice = 1500;

  onDistanceChange(distance: number): void {
    this.selectedDistance = distance;
  }

  onAvailabilityChange(filter: TaskerAvailabilityFilter): void {
    this.selectedAvailability = filter;
  }

  onRatingChange(rating: number): void {
    this.selectedRating = rating;
  }

  onMaxHourlyRateChange(value: string): void {
    const maxHourlyRate = Number(value);

    this.selectedMaxHourlyRate =
      maxHourlyRate >= this.maxPrice
        ? undefined
        : maxHourlyRate;
  }

  applyFilters(): void {
    this.filtersChange.emit({
      distance: this.selectedDistance,
      rating: this.selectedRating,
      minHourlyRate: this.selectedMinHourlyRate,
      maxHourlyRate: this.selectedMaxHourlyRate,
      availabilityFilter: this.selectedAvailability,
    });
  }

  clearAvailability(): void {
    this.selectedAvailability = undefined;
  }

  clearAll(): void {
    this.selectedDistance = 2;
    this.selectedAvailability = undefined;
    this.selectedRating = undefined;
    this.selectedMinHourlyRate = undefined;
    this.selectedMaxHourlyRate = undefined;

    this.filtersChange.emit({
      distance: 2,
      rating: undefined,
      minHourlyRate: undefined,
      maxHourlyRate: undefined,
      availabilityFilter: undefined,
    });
  }
}