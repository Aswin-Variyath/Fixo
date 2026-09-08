import {
    Component,
    DestroyRef,
    inject,
    OnInit,
    signal
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
    debounceTime,
    distinctUntilChanged,
    filter,
    Subject,
    switchMap
} from 'rxjs';

import { Footer } from '../../../shared/components/footer/footer';
import { Navbar } from '../../../shared/components/navbar/navbar';

import { CategoryApi } from '../home/categories/category-api';
import { CategoryService } from '../home/categories/category.service';
import { CategoryStore } from '../home/categories/category.store';
import { Category } from '../home/categories/category.types';

import { ServiceApi } from '../home/services/service-api';
import { ServiceService } from '../home/services/service.service';
import { ServiceStore } from '../home/services/service.store';

import { ServicesHeader } from './sections/services-header/services-header';
import { Search } from './sections/search/search';
import { ServiceResults } from './sections/service-results/service-results';

@Component({
    selector: 'app-customer-service',
    imports: [
        Navbar,
        Footer,
        ServicesHeader,
        Search,
        ServiceResults
    ],
    providers: [
        CategoryApi,
        CategoryService,
        CategoryStore,
        ServiceApi,
        ServiceService,
        ServiceStore
    ],
    templateUrl: './customer-service.html',
    styleUrl: './customer-service.css',
})
export class CustomerService implements OnInit {

    private readonly route = inject(ActivatedRoute);
    private readonly categoryService = inject(CategoryService);
    private readonly serviceService = inject(ServiceService);
    private readonly destroyRef = inject(DestroyRef);

    private readonly searchSubject = new Subject<string>();

    private readonly pageSize = 6;

    private currentOffset = 0;
    private currentSearch = '';

    readonly categorySlug =
        this.route.snapshot.queryParamMap.get('category');

    readonly categories =
        this.categoryService.categories;

    readonly selectedCategory =
        signal<Category | null>(null);

    categoryId: string | null = null;

    readonly services = this.serviceService.services;
    readonly hasMore = this.serviceService.hasMore;
    readonly isLoading = this.serviceService.isLoading;

    ngOnInit(): void {

        this.categoryService
            .loadCategories()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {

                    const category =
                        this.categoryService
                            .categories()
                            .find(
                                (category) =>
                                    category.slug ===
                                    this.categorySlug
                            );

                    this.selectedCategory.set(
                        category ?? null
                    );

                    this.categoryId =
                        category?.id ?? null;

                    if (!this.categoryId) {
                        return;
                    }

                    this.loadInitialServices();
                },

                error: () => {
                    this.selectedCategory.set(null);
                    this.categoryId = null;
                },
            });


        this.searchSubject
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                filter(
                    (searchText) =>
                        searchText.length > 0
                ),
                switchMap((searchText) => {

                    if (!this.categoryId) {
                        return [];
                    }

                    this.currentSearch =
                        searchText;

                    this.currentOffset = 0;

                    return this.serviceService.loadServices(
                        this.categoryId,
                        searchText,
                        this.pageSize,
                        this.currentOffset
                    );
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }


    onSearch(searchText: string): void {

        const trimmedSearchText =
            searchText.trim();

        if (!trimmedSearchText) {

            this.currentSearch = '';
            this.currentOffset = 0;

            this.loadInitialServices();

            return;
        }

        this.searchSubject.next(
            trimmedSearchText
        );
    }


    loadMore(): void {

        if (
            !this.categoryId ||
            !this.hasMore() ||
            this.isLoading()
        ) {
            return;
        }

        const nextOffset =
            this.currentOffset +
            this.pageSize;

        this.serviceService
            .loadMoreServices(
                this.categoryId,
                this.currentSearch || undefined,
                this.pageSize,
                nextOffset
            )
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: () => {
                    this.currentOffset =
                        nextOffset;
                },
            });
    }


    private loadInitialServices(): void {

        if (!this.categoryId) {
            return;
        }

        this.currentOffset = 0;

        this.serviceService
            .loadServices(
                this.categoryId,
                this.currentSearch || undefined,
                this.pageSize,
                this.currentOffset
            )
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe();
    }
}