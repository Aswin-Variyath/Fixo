import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ENV } from '../../../../../environments/environments';
import { Observable } from 'rxjs';
import { CategoryApiResponse } from './category.types';

@Service()
export class CategoryApi {

    private readonly http = inject(HttpClient)
    private readonly categoryUrl = `${ENV.API_URL}/categories`

    getCategories():Observable<CategoryApiResponse> {
        return this.http.get<CategoryApiResponse>(this.categoryUrl)
    }
}
