import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ENV } from '../../../../../../environments/environments';
import { NearbyTaskerSearchApiResponse, NearbyTaskerSearchCriteria } from '../types/nearby-tasker.types';
import { Observable } from 'rxjs';

@Service()
export class NearbyTaskerApi {
    private readonly http = inject(HttpClient)

    private readonly taskerUrl = `${ENV.API_URL}/taskers/nearby`

    createSearch(criteria:NearbyTaskerSearchCriteria):Observable<NearbyTaskerSearchApiResponse> {
        let params = new HttpParams()
        .set('serviceId',criteria.serviceId)
        .set('distance',criteria.distance)

        if(criteria.addressId) {
            params = params.set('addressId',criteria.addressId)
        }else {
            params = params
            .set('latitude',criteria.latitude!)
            .set('longitude',criteria.longitude!)
        }
        return this.http.get<NearbyTaskerSearchApiResponse>(this.taskerUrl,{params})
    }

    getSearchResults(searchId:string,page:number):Observable<NearbyTaskerSearchApiResponse> {
        const params = new HttpParams()
        .set('searchId', searchId)
        .set('page',page)
        return this.http.get<NearbyTaskerSearchApiResponse>(this.taskerUrl,{params})
    }
}
