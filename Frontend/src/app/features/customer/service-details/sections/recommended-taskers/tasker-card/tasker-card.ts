import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface TaskerPresentation {
  readonly imageUrl: string;
  readonly name: string;
  readonly title: string;
  readonly rating: string;
  readonly reviewCount: number;
  readonly distance: string;
  readonly availability: string;
}

@Component({
  selector: 'app-tasker-card',
  imports: [RouterLink],
  templateUrl: './tasker-card.html',
  styleUrl: './tasker-card.css',
})
export class TaskerCard {
  readonly tasker = input.required<TaskerPresentation>();
}
