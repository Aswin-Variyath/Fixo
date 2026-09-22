import { TestBed } from '@angular/core/testing';

import { HomeNearbyTaskerService } from './home-nearby-tasker-service';

describe('HomeNearbyTaskerService', () => {
  let service: HomeNearbyTaskerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeNearbyTaskerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
