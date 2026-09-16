import { TestBed } from '@angular/core/testing';

import { NearbyTaskerApi } from './nearby-tasker-api';

describe('NearbyTaskerApi', () => {
  let service: NearbyTaskerApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NearbyTaskerApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
