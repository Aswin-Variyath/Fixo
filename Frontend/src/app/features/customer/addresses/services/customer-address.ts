import { inject, Service } from '@angular/core';
import { CustomerAddressApi } from '../api/customer-address-api';
import { Observable } from 'rxjs';
import { CustomerAddressApiResponse } from '../types/customer-address.types';

@Service()
export class CustomerAddress {
    private readonly customerAddressApi = inject(CustomerAddressApi)

    getAddress():Observable<CustomerAddressApiResponse> {
        return this.customerAddressApi.getAddresses()
    }
}
