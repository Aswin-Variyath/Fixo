import { inject, Service } from '@angular/core';
import { SearchSuggestionApi } from '../api/search-suggestion-api';
import { map, Observable } from 'rxjs';
import { SearchSuggestionData, SearchSuggestionResponse } from '../types/search-suggestion';

@Service()
export class SearchSuggestion {
    private readonly searchSuggestionApi = inject(SearchSuggestionApi)

    search(query:string):Observable<SearchSuggestionData> {
        return this.searchSuggestionApi.search(query).pipe(map((res)=>res.data))
    }
}
