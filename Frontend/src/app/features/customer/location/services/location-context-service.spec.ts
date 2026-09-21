import { TestBed } from '@angular/core/testing';

import { LocationContextService } from './location-context-service';

describe('LocationContextService', () => {
  let service: LocationContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
