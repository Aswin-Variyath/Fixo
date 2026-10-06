import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  output,
  ViewChild,
  signal,
} from '@angular/core';

import { TaskerSearch } from '../../services/tasker-search';
import {
  TaskerSearchEmptyState,
  TaskerSearchItem,
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
  readonly selectedServiceId = input<string | undefined>();
  readonly selectedServiceName = input<string | undefined>();
  readonly expandedTaskerId = signal<string | null>(null);

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

  toggleWeeklyAvailability(taskerProfileId: string): void {
    this.expandedTaskerId.update((expandedId) =>
      expandedId === taskerProfileId ? null : taskerProfileId
    );
  }

  displayedServices(tasker: TaskerSearchItem) {
    const services = tasker.services ?? [];
    const selectedId = this.selectedServiceId();
    const selectedName = this.selectedServiceName()?.toLocaleLowerCase();
    const prioritizedServices = selectedId || selectedName
      ? [
          ...services.filter(
            (service) =>
              service.id === selectedId ||
              (!!selectedName && service.name.toLocaleLowerCase().includes(selectedName))
          ),
          ...services.filter(
            (service) =>
              service.id !== selectedId &&
              (!selectedName || !service.name.toLocaleLowerCase().includes(selectedName))
          ),
        ]
      : services;

    return prioritizedServices.slice(0, 2);
  }

  hiddenServiceCount(tasker: TaskerSearchItem): number {
    return Math.max(0, (tasker.services?.length ?? 0) - 2);
  }

  availableDayCount(tasker: TaskerSearchItem): number {
    return tasker.availability?.days?.filter(
      (day) => day.windows.length > 0
    ).length ?? 0;
  }

  formatTime(time: string): string {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
      weekday: 'long',
    });
  }
}
