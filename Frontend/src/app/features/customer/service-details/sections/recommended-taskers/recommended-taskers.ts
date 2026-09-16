import { Component, inject, input, signal } from '@angular/core';
import { TaskerCard } from './tasker-card/tasker-card';
import { NearbyTasker } from '../../../taskers/nearby/services/nearby-tasker';
import { NearbyTaskerItem, TaskerSectionState } from '../../../taskers/nearby/types/nearby-tasker.types';

@Component({
  selector: 'app-recommended-taskers',
  imports: [TaskerCard],
  templateUrl: './recommended-taskers.html',
  styleUrl: './recommended-taskers.css',
})
export class RecommendedTaskers {
  private readonly nearbyTaskerService = inject(NearbyTasker)
  readonly serviceId = input.required<string>()
  readonly taskerState = signal<TaskerSectionState>("loading")
  readonly taskers = signal<NearbyTaskerItem[]>([])

  loadTasker():void {
    this.taskerState.set('loading')

    this.nearbyTaskerService.createSearch({
      serviceId:this.serviceId(),
      distance:10,
      latitude:11.310136,
      longitude:75.898945
    })
    .subscribe({
      next:(response) => {
        this.taskers.set(response.data.taskers)
        this.taskerState.set(response.data.taskers.length > 0 ? 'success' : 'empty') 
      },
      error:(error)=> {
        console.error('Failed to load nearby taskers', error)
        this.taskerState.set('error')
      }
    })
  }
}