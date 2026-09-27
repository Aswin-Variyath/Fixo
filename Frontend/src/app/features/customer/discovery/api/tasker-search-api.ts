import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ENV } from '../../../../../environments/environments';
import { TaskerSearchApiResponse, TaskerSearchPaginationParams, TaskerSearchParams, TaskerSearchResponse } from '../types/tasker-search';
import { map, Observable } from 'rxjs';

@Service()
export class TaskerSearchApi {
    private readonly http = inject(HttpClient)

    private readonly taskerSearchUrl = `${ENV.API_URL}/taskers/nearby`

    searchTaskers(params:TaskerSearchParams):Observable<TaskerSearchResponse> {
        let httpParams = new HttpParams()

        if (params.serviceId) {
    httpParams = httpParams.set('serviceId', params.serviceId);
}
        if(params.addressId) {
            httpParams = httpParams.set('addressId',params.addressId)
        }
        if(params.latitude !== undefined) {
            httpParams = httpParams.set('latitude',params.latitude)
        }
        if(params.longitude !== undefined) {
            httpParams = httpParams.set('longitude',params.longitude)
        }
        
        httpParams = httpParams.set('distance',params.distance)

        if(params.requestedDate) {
            httpParams = httpParams.set("requestedDate", params.requestedDate)
        }
        if(params.requestedTime) {
            httpParams = httpParams.set("requestedTime",params.requestedTime)
        }
        if(params.searchId) {
            httpParams = httpParams.set('searchId',params.searchId)
        }
        if(params.page !== undefined) {
            httpParams = httpParams.set('page',params.page)
        }
        if(params.sortBy) {
            httpParams = httpParams.set('sortBy',params.sortBy)
        }
        return this.http.get<TaskerSearchApiResponse>(this.taskerSearchUrl,{params:httpParams})
        .pipe(map((response)=>response.data))

    }

    loadNextPage(
  params: TaskerSearchPaginationParams
): Observable<TaskerSearchResponse> {
  let httpParams = new HttpParams()
    .set('searchId', params.searchId)
    .set('page', params.page);

  return this.http
    .get<TaskerSearchApiResponse>(
      this.taskerSearchUrl,
      { params: httpParams }
    )
    .pipe(
      map((response) => response.data)
    );
}
}
