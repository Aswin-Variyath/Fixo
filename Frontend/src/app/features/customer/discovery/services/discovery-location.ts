import { inject, Injectable, Service } from '@angular/core';
import { DiscoveryLocationApi } from '../api/discovery-location-api';
import { Observable } from 'rxjs';
import { DiscoveryLocationAutocompleteResponse, DiscoveryReverseGeocodingResponse } from '../types/discovery-location.types';

@Service()
export class DiscoveryLocation {
  private readonly discoveryLocationApi = inject(
    DiscoveryLocationApi
  );

  autocomplete(text:string):Observable<DiscoveryLocationAutocompleteResponse> {
    return this.discoveryLocationApi.autocomplete(text)
  }
  reverseGeocode(latitude:number,longitude:number):Observable<DiscoveryReverseGeocodingResponse>{
    return this.discoveryLocationApi.reverseGecoding(latitude,longitude)
  }
}