import { TestBed } from '@angular/core/testing';

import { TaskerSearch } from './tasker-search';

describe('TaskerSearch', () => {
  let service: TaskerSearch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskerSearch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
