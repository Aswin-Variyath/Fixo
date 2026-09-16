import { TestBed } from '@angular/core/testing';

import { NearbyTasker } from './nearby-tasker';

describe('NearbyTasker', () => {
  let service: NearbyTasker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NearbyTasker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
