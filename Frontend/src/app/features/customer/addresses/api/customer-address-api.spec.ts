import { TestBed } from '@angular/core/testing';

import { CustomerAddressApi } from './customer-address-api';

describe('CustomerAddressApi', () => {
  let service: CustomerAddressApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerAddressApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
