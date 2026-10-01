import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';

import { TaskerSearch } from '../../services/tasker-search';
import {
  TaskerSearchEmptyState,
  TaskerSearchSort,
} from '../../types/tasker-search';
import { DiscoveryFilters } from '../filters/filters';

@Component({
  selector: 'app-tasker-results',
  imports: [DecimalPipe],
  templateUrl: './tasker-results.html',
  styleUrl: './tasker-results.css',
})
export class TaskerResults implements AfterViewInit {
  readonly taskerSearch = inject(TaskerSearch);

  readonly appliedFilters = input<DiscoveryFilters>();
  readonly emptyState = input<TaskerSearchEmptyState | null>(null);

  readonly removeDistance = output<void>();
  readonly removeAvailability = output<void>();
  readonly removeRating = output<void>();
  readonly removePrice = output<void>();
  readonly sortChange = output<TaskerSearchSort>();

  @ViewChild('scrollSentinel')
  private readonly scrollSentinel!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    console.log('1. TaskerResults view initialized');
    console.log('2. Sentinel:', this.scrollSentinel);

    const observer = new IntersectionObserver(
      (entries) => {
        console.log('3. IntersectionObserver fired');
        console.log('4. Entry:', entries[0]);
        console.log('5. Is intersecting:', entries[0]?.isIntersecting);
        console.log('6. Loading:', this.taskerSearch.loading());
        console.log('7. Has more:', this.taskerSearch.hasMore());

        if (entries[0]?.isIntersecting) {
          console.log('8. Calling loadNextPage()');

          this.taskerSearch.loadNextPage();
        }
      },
      {
        rootMargin: '300px',
      }
    );

    observer.observe(this.scrollSentinel.nativeElement);

    console.log('9. Observer attached');
  }

  onSortChange(sortBy: TaskerSearchSort): void {
    this.sortChange.emit(sortBy);
  }
}