import { TestBed } from '@angular/core/testing';

import { TaskerSearchApi } from './tasker-search-api';

describe('TaskerSearchApi', () => {
  let service: TaskerSearchApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskerSearchApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
