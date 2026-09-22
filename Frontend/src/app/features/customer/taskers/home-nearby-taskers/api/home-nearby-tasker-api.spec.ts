import { TestBed } from '@angular/core/testing';

import { HomeNearbyTaskerApi } from './home-nearby-tasker-api';

describe('HomeNearbyTaskerApi', () => {
  let service: HomeNearbyTaskerApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeNearbyTaskerApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
