import { inject, Service } from '@angular/core';
import { HomeNearbyTaskerApi } from '../api/home-nearby-tasker-api';
import { HomeNearbyTaskerSearchApiResponse, HomeNearbyTaskerSearchCriteria } from '../types/home-nearby-tasker.types';
import { Observable } from 'rxjs';

@Service()
export class HomeNearbyTaskerService {
    private readonly homeNearbyTaskerApi = inject(HomeNearbyTaskerApi)

    createSearch(criteria:HomeNearbyTaskerSearchCriteria):Observable<HomeNearbyTaskerSearchApiResponse>{
        return this.homeNearbyTaskerApi.createSearch(criteria)
    }

    getSearchResults(searchId:string,page:number):Observable<HomeNearbyTaskerSearchApiResponse> {
        return this.homeNearbyTaskerApi.getSearchResults(searchId,page)
    }

}
