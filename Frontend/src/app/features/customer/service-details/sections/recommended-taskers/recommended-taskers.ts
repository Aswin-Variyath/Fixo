import {
    Component,
    ElementRef,
    effect,
    inject,
    input,
    OnDestroy,
    signal,
    ViewChild,
} from '@angular/core';

import {
    SelectedLocation,
} from '../../../addresses/types/customer-address.types';

import { NearbyTaskerItem } from '../../../taskers/nearby/types/nearby-tasker.types';
import { NearbyTasker } from '../../../taskers/nearby/services/nearby-tasker';

import {
    TaskerCard,
    TaskerPresentation,
} from './tasker-card/tasker-card';

type TaskerSectionState =
    | 'loading'
    | 'success'
    | 'empty'
    | 'location-required'
    | 'error';

@Component({
    selector: 'app-recommended-taskers',
    imports: [TaskerCard],
    templateUrl: './recommended-taskers.html',
    styleUrl: './recommended-taskers.css',
})
export class RecommendedTaskers implements OnDestroy {

    private readonly nearbyTaskerService =
        inject(NearbyTasker);

    readonly serviceId =
        input.required<string>();

    readonly selectedLocation =
        input<SelectedLocation | null>(null);

    readonly taskerState =
        signal<TaskerSectionState>('loading');

    readonly taskers =
        signal<TaskerPresentation[]>([]);

    readonly isLoadingMore =
        signal(false);

    readonly hasMore =
        signal(false);

    readonly selectedDistance =
        signal(10);

        readonly selectedSort =
    signal<'recommended' | 'nearest'>('recommended');

    private searchId: string | null = null;

    private currentPage = 1;

    private observer?: IntersectionObserver;

    @ViewChild('loadMoreTrigger')
    set loadMoreTrigger(
        element: ElementRef<HTMLElement> | undefined
    ) {
        if (!element) return;

        this.observer?.disconnect();

        this.observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (!entry.isIntersecting) return;

                this.loadNextPage();
            },
            {
                root: null,
                rootMargin: '300px',
                threshold: 0,
            }
        );

        this.observer.observe(
            element.nativeElement
        );
    }

    constructor() {
        effect(() => {
            const location = this.selectedLocation();

            if (!location) return;

            this.resetSearch();
            this.loadTasker();
        });
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
    }

    private resetSearch(): void {
        this.searchId = null;
        this.currentPage = 1;

        this.hasMore.set(false);
        this.isLoadingMore.set(false);
        this.taskers.set([]);
    }

    onDistanceChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const distance = Number(select.value);

    this.selectedDistance.set(distance);

    this.resetSearch();
    this.loadTasker();
}
onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const sortBy = select.value as 'recommended' | 'nearest';

    this.selectedSort.set(sortBy);

    this.resetSearch();
    this.loadTasker();
}


    loadTasker(): void {
        const location = this.selectedLocation();

        if (!location) return;

        this.taskerState.set('loading');

        this.nearbyTaskerService
            .createSearch({
                serviceId: this.serviceId(),
                distance: this.selectedDistance(),
                sortBy: this.selectedSort(),
                latitude: location.latitude!,
                longitude: location.longitude!,
            })
            .subscribe({
                next: (response) => {
                    const taskers =
                        response.data.taskers.map(
                            (tasker) =>
                                this.toPresentation(tasker)
                        );

                    this.searchId =
                        response.data.searchId;

                    this.currentPage =
                        response.data.page;

                    this.hasMore.set(
                        response.data.hasMore
                    );

                    this.taskers.set(taskers);

                    this.taskerState.set(
                        taskers.length > 0
                            ? 'success'
                            : 'empty'
                    );
                },

                error: (error) => {
                    console.error(
                        'Failed to load nearby taskers',
                        error
                    );

                    this.taskerState.set('error');
                },
            });
    }

    private loadNextPage(): void {
        if (
            !this.searchId ||
            !this.hasMore() ||
            this.isLoadingMore()
        ) {
            return;
        }

        this.isLoadingMore.set(true);

        const nextPage =
            this.currentPage + 1;

        this.nearbyTaskerService
            .getSearchResults(
                this.searchId,
                nextPage
            )
            .subscribe({
                next: (response) => {
                    const newTaskers =
                        response.data.taskers.map(
                            (tasker) =>
                                this.toPresentation(tasker)
                        );

                    this.taskers.update(
                        (currentTaskers) => [
                            ...currentTaskers,
                            ...newTaskers,
                        ]
                    );

                    this.currentPage =
                        response.data.page;

                    this.hasMore.set(
                        response.data.hasMore
                    );

                    this.isLoadingMore.set(false);
                },

                error: (error) => {
                    console.error(
                        'Failed to load more taskers',
                        error
                    );

                    this.isLoadingMore.set(false);
                },
            });
    }

    private toPresentation(
        tasker: NearbyTaskerItem
    ): TaskerPresentation {
        return {
            imageUrl:
                tasker.profileImageUrl ??
                'assets/images/default-profile.png',

            name:
                `${tasker.firstName} ${tasker.lastName}`,

            title:
                'Service Professional',

            rating:
                tasker.averageRating.toFixed(1),

            reviewCount:
                tasker.totalReviews,

            distance:
                `${tasker.distanceKm.toFixed(1)} km`,

            availability:
                'Available',
        };
    }
}