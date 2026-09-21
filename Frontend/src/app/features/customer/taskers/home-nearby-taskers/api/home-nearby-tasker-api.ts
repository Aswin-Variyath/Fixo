import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ENV } from '../../../../../../environments/environments';
import { HomeNearbyTaskerSearchApiResponse, HomeNearbyTaskerSearchCriteria } from '../types/home-nearby-tasker.types';
import { Observable } from 'rxjs';

@Service()
export class HomeNearbyTaskerApi {
    private readonly http = inject(HttpClient)
    private readonly taskerUrl = `${ENV.API_URL}/taskers/discover`
    createSearch(criteria:HomeNearbyTaskerSearchCriteria):Observable<HomeNearbyTaskerSearchApiResponse> {
        let params = new HttpParams()
        .set('distance',criteria.distance)
        .set('sortBy',criteria.sortBy)

        if(criteria.addressId) {
            params = params.set('addressId',criteria.addressId)
        }else {
            params = params.set('latitude',criteria.latitude!)
            .set('longitude',criteria.longitude!)
        }
        return this.http.get<HomeNearbyTaskerSearchApiResponse>(this.taskerUrl,{params})
    }
    getSearchResults(searchId:string,page:number):Observable<HomeNearbyTaskerSearchApiResponse> {
        const params = new HttpParams()
        .set('searchId',searchId)
        .set('page',page)
        return this.http.get<HomeNearbyTaskerSearchApiResponse>(this.taskerUrl,{params})
    }
}
