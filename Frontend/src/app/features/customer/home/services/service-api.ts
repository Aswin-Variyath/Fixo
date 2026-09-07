import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ENV } from '../../../../../environments/environments';
import { Observable } from 'rxjs';
import { ServiceApiResponse } from './service.types';

@Service()
export class ServiceApi {
    private readonly http = inject(HttpClient)
    private readonly serviceUrl = `${ENV.API_URL}/services`

    searchServices(search:string):Observable<ServiceApiResponse> {
        const params = new HttpParams().set('search',search)
        return this.http.get<ServiceApiResponse>(this.serviceUrl,{params})
    }
}
