import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ENV } from '../../../../../environments/environments';
import { ServiceApiResponse, ServiceDetailsApiResponse } from './service.types';

@Injectable()
export class ServiceApi {
    private readonly http = inject(HttpClient);

    private readonly serviceUrl = `${ENV.API_URL}/services`;

    /**
     * Search the complete service catalogue.
     * Used by Customer Home.
     */
    searchServices(
        search: string,
        limit = 6,
        offset = 0
    ): Observable<ServiceApiResponse> {
        const params = new HttpParams()
            .set('search', search)
            .set('limit', limit)
            .set('offset', offset);

        return this.http.get<ServiceApiResponse>(
            this.serviceUrl,
            { params }
        );
    }

    /**
     * Get services for a selected category.
     *
     * When search is provided, the search is restricted
     * to that category.
     */
    getServices(
        categoryId: string,
        search?: string,
        limit = 6,
        offset = 0
    ): Observable<ServiceApiResponse> {

        let params = new HttpParams()
            .set('categoryId', categoryId)
            .set('limit', limit)
            .set('offset', offset);

        if (search?.trim()) {
            params = params.set('search', search.trim());
        }

        return this.http.get<ServiceApiResponse>(
            this.serviceUrl,
            { params }
        );
    }

    getServiceById(serviceId:string):Observable<ServiceDetailsApiResponse> {
        return this.http.get<ServiceDetailsApiResponse>(`${this.serviceUrl}/${serviceId}`)
    }
}