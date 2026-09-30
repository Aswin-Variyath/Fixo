import { Component, output } from '@angular/core';
import { TaskerAvailabilityFilter } from '../../types/tasker-search';

export interface DiscoveryFilters {
  distance:number
  rating?:number
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
  readonly availabilityChange = output<TaskerAvailabilityFilter | undefined>()
  selectedDistance = 2;
  selectedAvailability: TaskerAvailabilityFilter | undefined

  selectedRating: number | undefined;

  onDistanceChange(distance:number):void {
    this.selectedDistance = distance
  }

  onAvailabilityChange(filter:TaskerAvailabilityFilter):void {
    this.selectedAvailability = filter
  }

  onRatingChange(rating:number):void {
    this.selectedRating = rating
  }

  applyFilters():void {
    this.filtersChange.emit({
      distance:this.selectedDistance,
      rating:this.selectedRating,
      availabilityFilter:this.selectedAvailability
    })
  }

  clearAvailability():void {
    this.selectedAvailability = undefined
  }

  clearAll():void {
    this.selectedDistance = 2
    this.selectedAvailability = undefined
    this.filtersChange.emit({
      distance:2,
      rating:undefined,
      availabilityFilter:undefined
    })
  }

}
