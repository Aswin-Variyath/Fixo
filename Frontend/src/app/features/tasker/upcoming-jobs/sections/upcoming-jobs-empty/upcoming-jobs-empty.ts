import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upcoming-jobs-empty',
  imports: [RouterLink],
  templateUrl: './upcoming-jobs-empty.html',
  styleUrl: './upcoming-jobs-empty.css',
})
export class UpcomingJobsEmpty {
  readonly refresh = output<void>();

  onRefresh(): void {
    this.refresh.emit();
  }
}
