import {
    Component,
    inject,
    output
} from '@angular/core';

import { ServiceStore } from '../../../home/services/service.store';

@Component({
    selector: 'app-service-results',
    imports: [],
    templateUrl: './service-results.html',
    styleUrl: './service-results.css',
})
export class ServiceResults {
    private readonly serviceStore = inject(ServiceStore);

    readonly services = this.serviceStore.services;
    readonly isLoading = this.serviceStore.isLoading;
    readonly error = this.serviceStore.error;
    readonly hasMore = this.serviceStore.hasMore;

    readonly loadMore = output<void>();
}