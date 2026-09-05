import { inject, Service } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

import { CategoryStore } from './category.store';
import { CategoryApiResponse } from './category.types';
import { CategoryApi } from './category-api';

@Service()
export class CategoryService {

    private readonly categoryApiService = inject(CategoryApi);
    private readonly categoryStore = inject(CategoryStore);

    readonly categories = this.categoryStore.categories;
    readonly isLoading = this.categoryStore.isLoading;
    readonly error = this.categoryStore.error;

    loadCategories(): Observable<CategoryApiResponse> {

        this.categoryStore.setLoading(true);
        this.categoryStore.setError(null);

        return this.categoryApiService.getCategories().pipe(

            tap((response) => {
                this.categoryStore.setCategories(response.data);
            }),

            catchError((error) => {
                console.error('Failed to load categories:', error);

                this.categoryStore.setError(
                    'Unable to load categories. Please try again.'
                );

                return throwError(() => error);
            }),

            finalize(() => {
                this.categoryStore.setLoading(false);
            })
        );
    }

    reset(): void {
        this.categoryStore.reset();
    }
}