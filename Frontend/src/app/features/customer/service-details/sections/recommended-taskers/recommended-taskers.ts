import {
    Component,
    effect,
    inject,
    input,
    signal,
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
export class RecommendedTaskers {
    private readonly nearbyTaskerService = inject(NearbyTasker);

    readonly serviceId = input.required<string>();

    readonly selectedLocation =
        input<SelectedLocation | null>(null);

    readonly taskerState =
        signal<TaskerSectionState>('loading');

    readonly taskers =
        signal<TaskerPresentation[]>([]);

    constructor() {
        effect(() => {
            const location = this.selectedLocation();

            if (!location) return;

            this.loadTasker();
        });
    }

    loadTasker(): void {
        const location = this.selectedLocation();

        if (!location) return;

        this.taskerState.set('loading');

        this.nearbyTaskerService
            .createSearch({
                serviceId: this.serviceId(),
                distance: 10,
                latitude: location.latitude!,
                longitude: location.longitude!,
            })
            .subscribe({
                next: (response) => {
                    const taskers = response.data.taskers.map(
                        (tasker) => this.toPresentation(tasker)
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

    private toPresentation(
        tasker: NearbyTaskerItem
    ): TaskerPresentation {
        return {
            imageUrl:
                tasker.profileImageUrl ??
                'assets/images/default-profile.png',

            name: `${tasker.firstName} ${tasker.lastName}`,

            title: 'Service Professional',

            rating: tasker.averageRating.toFixed(1),

            reviewCount: tasker.totalReviews,

            distance: `${tasker.distanceKm.toFixed(1)} km`,

            availability: 'Available',
        };
    }
}