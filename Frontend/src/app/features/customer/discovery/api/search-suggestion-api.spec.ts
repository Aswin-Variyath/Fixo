import { TestBed } from '@angular/core/testing';

import { SearchSuggestionApi } from './search-suggestion-api';

describe('SearchSuggestionApi', () => {
  let service: SearchSuggestionApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchSuggestionApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
