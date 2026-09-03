import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upcoming-jobs-header',
  imports: [RouterLink],
  templateUrl: './upcoming-jobs-header.html',
  styleUrl: './upcoming-jobs-header.css',
})
export class UpcomingJobsHeader {
  readonly count = input<number>(5);
}
