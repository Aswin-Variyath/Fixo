import { inject, Service } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

import { ServiceApi } from './service-api';
import { ServiceApiResponse } from './service.types';
import { ServiceStore } from './service.store';

@Service()
export class ServiceService {

    private readonly serviceApi = inject(ServiceApi);
    private readonly serviceStore = inject(ServiceStore);

    readonly services = this.serviceStore.services;
    readonly categories = this.serviceStore.categories;
    readonly hasMore = this.serviceStore.hasMore;
    readonly isLoading = this.serviceStore.isLoading;
    readonly error = this.serviceStore.error;

    searchServices(search: string): Observable<ServiceApiResponse> {

        this.serviceStore.setLoading(true);
        this.serviceStore.setError(null);

        return this.serviceApi.searchServices(search).pipe(

            tap((response) => {
                this.serviceStore.setServices(response.data.services);
                this.serviceStore.setCategories(response.data.categories);
                this.serviceStore.setHasMore(response.data.hasMore);
            }),

            catchError((error) => {
                console.error('Failed to search services:', error);

                this.serviceStore.setError(
                    'Unable to search services. Please try again.'
                );

                return throwError(() => error);
            }),

            finalize(() => {
                this.serviceStore.setLoading(false);
            })
        );
    }

    reset(): void {
        this.serviceStore.reset();
    }
}