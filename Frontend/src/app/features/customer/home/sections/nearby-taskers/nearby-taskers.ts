import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';

import { LocationModal } from '../../../location/components/location-modal/location-modal';
import { LocationContextService } from '../../../location/services/location-context-service';
import { SelectedLocation } from '../../../addresses/types/customer-address.types';

import { HomeNearbyTaskerService } from '../../../taskers/home-nearby-taskers/services/home-nearby-tasker-service';
import {
  HomeNearbyTaskerItem,
  HomeNearbyTaskerSectionState,
  TaskerDiscoverySort,
} from '../../../taskers/home-nearby-taskers/types/home-nearby-tasker.types';

import { TaskerCard } from '../../../service-details/sections/recommended-taskers/tasker-card/tasker-card';

@Component({
  selector: 'app-nearby-taskers',
  imports: [LocationModal, TaskerCard],
  providers: [HomeNearbyTaskerService],
  templateUrl: './nearby-taskers.html',
  styleUrl: './nearby-taskers.css',
})
export class NearbyTaskers implements OnInit {
  private readonly customerLocation = inject(LocationContextService);
  private readonly homeNearbyTasker = inject(HomeNearbyTaskerService);

  readonly showLocationModal = signal(false);

  readonly taskers = signal<HomeNearbyTaskerItem[]>([]);

  readonly sectionState =
    signal<HomeNearbyTaskerSectionState>('loading');

  readonly distance = signal(5);

  readonly sortBy =
    signal<TaskerDiscoverySort>('recommended');

  readonly sortDropdownOpen = signal(false);

  readonly searchId = signal<string | null>(null);

  readonly currentPage = signal(1);

  readonly hasMore = signal(false);

  readonly loadingMore = signal(false);

  private readonly intersectionObserver =
    new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          this.loadMoreTaskers();
        }
      },
      {
        rootMargin: '200px',
      }
    );

  @ViewChild('loadMoreTrigger')
  set loadMoreTrigger(
    element: ElementRef<HTMLDivElement> | undefined
  ) {
    if (!element) {
      return;
    }

    this.intersectionObserver.observe(element.nativeElement);
  }

  ngOnInit(): void {
    this.checkLocation();
  }

  private checkLocation(): void {
    const location = this.customerLocation.location();

    if (!location) {
      this.sectionState.set('location-required');
      this.showLocationModal.set(true);
      return;
    }

    this.loadTaskers(location);
  }

  onLocationSelected(location: SelectedLocation): void {
    this.showLocationModal.set(false);
    this.loadTaskers(location);
  }

  closeLocationModal(): void {
    this.showLocationModal.set(false);
    this.sectionState.set('location-required');
  }

  private loadTaskers(location: SelectedLocation): void {
    this.sectionState.set('loading');

    this.currentPage.set(1);
    this.searchId.set(null);
    this.hasMore.set(false);
    this.loadingMore.set(false);

    const criteria = {
      ...(location.source === 'address'
        ? {
            addressId: location.addressId,
          }
        : {
            latitude: location.latitude,
            longitude: location.longitude,
          }),

      distance: this.distance(),
      sortBy: this.sortBy(),
    };

    this.homeNearbyTasker.createSearch(criteria).subscribe({
      next: (response) => {
        this.taskers.set(response.data.taskers);

        this.searchId.set(response.data.searchId);

        this.currentPage.set(response.data.page);

        this.hasMore.set(response.data.hasMore);

        this.sectionState.set(
          response.data.taskers.length > 0
            ? 'success'
            : 'empty'
        );
      },

      error: (error) => {
        console.error(
          'Failed to load nearby taskers',
          error
        );

        this.sectionState.set('error');
      },
    });
  }

  loadMoreTaskers(): void {
    const searchId = this.searchId();

    if (
      !searchId ||
      !this.hasMore() ||
      this.loadingMore()
    ) {
      return;
    }

    this.loadingMore.set(true);

    const nextPage = this.currentPage() + 1;

    this.homeNearbyTasker
      .getSearchResults(searchId, nextPage)
      .subscribe({
        next: (response) => {
          this.taskers.update((taskers) => [
            ...taskers,
            ...response.data.taskers,
          ]);

          this.currentPage.set(response.data.page);

          this.hasMore.set(response.data.hasMore);

          this.loadingMore.set(false);
        },

        error: (error) => {
          console.error(
            'Failed to load more taskers',
            error
          );

          this.loadingMore.set(false);
        },
      });
  }

  toggleSortDropdown(): void {
    this.sortDropdownOpen.update(
      (open) => !open
    );
  }

  selectSort(
    sortBy: TaskerDiscoverySort
  ): void {
    this.sortDropdownOpen.set(false);

    this.setSortBy(sortBy);
  }

  setDistance(distance: number): void {
    this.distance.set(distance);

    const location =
      this.customerLocation.location();

    if (location) {
      this.loadTaskers(location);
    }
  }

  setSortBy(
    sortBy: TaskerDiscoverySort
  ): void {
    this.sortBy.set(sortBy);

    const location =
      this.customerLocation.location();

    if (location) {
      this.loadTaskers(location);
    }
  }
}