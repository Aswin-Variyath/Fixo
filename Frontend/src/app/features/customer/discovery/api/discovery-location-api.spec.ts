import { TestBed } from '@angular/core/testing';

import { DiscoveryLocationApi } from './discovery-location-api';

describe('DiscoveryLocationApi', () => {
  let service: DiscoveryLocationApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscoveryLocationApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
