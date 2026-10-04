import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ENV } from '../../../../../environments/environments';
import { Observable } from 'rxjs';
import { SearchSuggestionResponse } from '../types/search-suggestion';

@Service()
export class SearchSuggestionApi {
    private readonly http = inject(HttpClient)

    private readonly searchSuggestionsUrl = `${ENV.API_URL}/taskers/search/suggestions`

    search(query:string):Observable<SearchSuggestionResponse> {
        const params = new HttpParams().set('query',query)
        return this.http.get<SearchSuggestionResponse>(this.searchSuggestionsUrl,{params})
    }

}
