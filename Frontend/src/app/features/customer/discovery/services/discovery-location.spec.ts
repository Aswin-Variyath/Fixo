import { TestBed } from '@angular/core/testing';

import { DiscoveryLocation } from './discovery-location';

describe('DiscoveryLocation', () => {
  let service: DiscoveryLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscoveryLocation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
