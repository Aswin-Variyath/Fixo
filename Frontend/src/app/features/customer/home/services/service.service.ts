import { inject, Injectable } from '@angular/core';
import {
    catchError,
    finalize,
    Observable,
    tap,
    throwError
} from 'rxjs';

import { ServiceApi } from './service-api';
import {
    Service,
    ServiceApiResponse,
    ServiceDetailsApiResponse
} from './service.types';
import { ServiceStore } from './service.store';
import { ServiceDetails } from '../../service-details/service-details';

@Injectable()
export class ServiceService {

    private readonly serviceApi = inject(ServiceApi);
    private readonly serviceStore = inject(ServiceStore);

    readonly services = this.serviceStore.services;
    readonly categories = this.serviceStore.categories;
    readonly hasMore = this.serviceStore.hasMore;
    readonly isLoading = this.serviceStore.isLoading;
    readonly error = this.serviceStore.error;

    searchServices(
        search: string,
        limit = 6,
        offset = 0
    ): Observable<ServiceApiResponse> {

        this.serviceStore.setLoading(true);
        this.serviceStore.setError(null);

        return this.serviceApi
            .searchServices(
                search,
                limit,
                offset
            )
            .pipe(
                tap((response) => {

                    this.serviceStore.setServices(
                        response.data.services
                    );

                    this.serviceStore.setCategories(
                        response.data.categories
                    );

                    this.serviceStore.setHasMore(
                        response.data.hasMore
                    );
                }),
                catchError((error) => {

                    console.error(
                        'Failed to search services:',
                        error
                    );

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

    loadMoreSearchServices(
        search: string,
        limit: number,
        offset: number
    ): Observable<ServiceApiResponse> {

        this.serviceStore.setLoading(true);
        this.serviceStore.setError(null);

        return this.serviceApi
            .searchServices(
                search,
                limit,
                offset
            )
            .pipe(
                tap((response) => {

                    this.serviceStore.appendServices(
                        response.data.services
                    );

                    this.serviceStore.setCategories(
                        response.data.categories
                    );

                    this.serviceStore.setHasMore(
                        response.data.hasMore
                    );
                }),
                catchError((error) => {

                    console.error(
                        'Failed to load more search services:',
                        error
                    );

                    this.serviceStore.setError(
                        'Unable to load more services. Please try again.'
                    );

                    return throwError(() => error);
                }),
                finalize(() => {
                    this.serviceStore.setLoading(false);
                })
            );
    }

    loadServices(
        categoryId: string,
        search?: string,
        limit = 6,
        offset = 0
    ): Observable<ServiceApiResponse> {

        this.serviceStore.setLoading(true);
        this.serviceStore.setError(null);

        return this.serviceApi
            .getServices(
                categoryId,
                search,
                limit,
                offset
            )
            .pipe(
                tap((response) => {

                    this.serviceStore.setServices(
                        response.data.services
                    );

                    this.serviceStore.setCategories(
                        response.data.categories
                    );

                    this.serviceStore.setHasMore(
                        response.data.hasMore
                    );
                }),
                catchError((error) => {

                    console.error(
                        'Failed to load services:',
                        error
                    );

                    this.serviceStore.setError(
                        'Unable to load services. Please try again.'
                    );

                    return throwError(() => error);
                }),
                finalize(() => {
                    this.serviceStore.setLoading(false);
                })
            );
    }

    loadMoreServices(
        categoryId: string,
        search: string | undefined,
        limit: number,
        offset: number
    ): Observable<ServiceApiResponse> {

        this.serviceStore.setLoading(true);
        this.serviceStore.setError(null);

        return this.serviceApi
            .getServices(
                categoryId,
                search,
                limit,
                offset
            )
            .pipe(
                tap((response) => {

                    this.serviceStore.appendServices(
                        response.data.services
                    );

                    this.serviceStore.setHasMore(
                        response.data.hasMore
                    );
                }),
                catchError((error) => {

                    console.error(
                        'Failed to load more services:',
                        error
                    );

                    this.serviceStore.setError(
                        'Unable to load more services. Please try again.'
                    );

                    return throwError(() => error);
                }),
                finalize(() => {
                    this.serviceStore.setLoading(false);
                })
            );
    }

    appendServices(services: Service[]): void {
        this.serviceStore.appendServices(services);
    }

    reset(): void {
        this.serviceStore.reset();
    }

    getServiceById(serviceId:string):Observable<ServiceDetailsApiResponse> {
        return this.serviceApi.getServiceById(serviceId).pipe(
            catchError((error)=> {
                console.error('Failed to load service details',error)
                return throwError(()=>error)
            })
        )
    }
}