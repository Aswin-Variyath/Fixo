import { inject, Service } from '@angular/core';
import { NearbyTaskerApi } from '../api/nearby-tasker-api';
import { NearbyTaskerSearchApiResponse, NearbyTaskerSearchCriteria } from '../types/nearby-tasker.types';
import { Observable } from 'rxjs';

@Service()
export class NearbyTasker {
    private readonly nearbyTaskerApi = inject(NearbyTaskerApi)

    createSearch(criteria:NearbyTaskerSearchCriteria):Observable<NearbyTaskerSearchApiResponse> {
        return this.nearbyTaskerApi.createSearch(criteria)
    }

    getSearchResults(searchId:string,page:number):Observable<NearbyTaskerSearchApiResponse> {
        return this.nearbyTaskerApi.getSearchResults(searchId,page)
    }
}
