import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ENV } from '../../../../../environments/environments';
import { Observable } from 'rxjs';
import { CustomerAddressApiResponse } from '../types/customer-address.types';

@Service()
export class CustomerAddressApi {
    private readonly http = inject(HttpClient)

    private readonly addressUrl = `${ENV.API_URL}/customer-addresses`

    getAddresses():Observable<CustomerAddressApiResponse> {
        return this.http.get<CustomerAddressApiResponse>(this.addressUrl)
    }
}
