import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { DiscoveryLocationAutocompleteResponse, DiscoveryReverseGeocodingResponse } from '../types/discovery-location.types';
import { ENV } from '../../../../../environments/environments';

@Service()
export class DiscoveryLocationApi {
    private readonly http = inject(HttpClient)
    private readonly reverseGeoCodingUrl = 'https://api.geoapify.com/v1/geocode/reverse'
    private readonly autocompleteUrl = 'https://api.geoapify.com/v1/geocode/autocomplete'

    autocomplete(text:string):Observable<DiscoveryLocationAutocompleteResponse> {
        const params = new HttpParams()
        .set('text',text)
        .set('apiKey',ENV.GEOAPIFY_API_KEY)
        return this.http.get<DiscoveryLocationAutocompleteResponse>(this.autocompleteUrl,{params})
    }

    reverseGecoding(latitude:number,longitude:number):Observable<DiscoveryReverseGeocodingResponse> {
        const params = new HttpParams()
        .set('lat',latitude)
        .set('lon',longitude)
        .set('format','json')
        .set('apiKey',ENV.GEOAPIFY_API_KEY)
        return this.http.get<DiscoveryReverseGeocodingResponse>(this.reverseGeoCodingUrl, {params})
    }

}
