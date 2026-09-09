import {
    Component,
    computed,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    Subject,
    switchMap,
} from 'rxjs';
import { RouterLink } from '@angular/router';

import { CategoryService } from '../../categories/category.service';
import { CategoryStore } from '../../categories/category.store';
import { ServiceApi } from '../../services/service-api';
import { ServiceService } from '../../services/service.service';
import { ServiceStore } from '../../services/service.store';

@Component({
    selector: 'app-services',
    imports: [RouterLink],
    providers: [
        CategoryService,
        CategoryStore,
        ServiceApi,
        ServiceService,
        ServiceStore,
    ],
    templateUrl: './services.html',
    styleUrl: './services.css',
})
export class Services implements OnInit {

    private readonly categoryService = inject(CategoryService);
    private readonly serviceService = inject(ServiceService);
    private readonly destroyRef = inject(DestroyRef);

    private readonly searchSubject = new Subject<string>();

    /*
     * Number of services requested per API call.
     *
     * Set to 1 temporarily for pagination testing.
     * Change back to 6 after testing.
     */
    private readonly pageSize = 6;

    private currentOffset = 0;
    private currentSearch = '';

    readonly categories = this.categoryService.categories;
    readonly isLoading = this.categoryService.isLoading;
    readonly error = this.categoryService.error;

    readonly services = this.serviceService.services;
    readonly searchCategories = this.serviceService.categories;
    readonly isSearching = this.serviceService.isLoading;
    readonly searchError = this.serviceService.error;
    readonly hasMore = this.serviceService.hasMore;

    readonly searchText = signal('');

    readonly serviceCategoryIcons = computed(() => {

        const categoryMap = new Map<string, string>();

        for (const category of this.searchCategories()) {
            categoryMap.set(category.id, category.icon);
        }

        return categoryMap;
    });

    ngOnInit(): void {

        this.categoryService
            .loadCategories()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        this.searchSubject
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                filter(
                    (searchText) =>
                        searchText.length > 0
                ),
                switchMap((searchText) => {

                    this.currentSearch = searchText;
                    this.currentOffset = 0;

                    return this.serviceService.searchServices(
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

        this.searchText.set(searchText);

        if (!trimmedSearchText) {

            this.currentSearch = '';
            this.currentOffset = 0;

            this.serviceService.reset();

            return;
        }

        this.searchSubject.next(
            trimmedSearchText
        );
    }

    loadMore(): void {

        if (
            !this.currentSearch ||
            !this.hasMore() ||
            this.isSearching()
        ) {
            return;
        }

        const nextOffset =
            this.currentOffset +
            this.pageSize;

        this.serviceService
            .loadMoreSearchServices(
                this.currentSearch,
                this.pageSize,
                nextOffset
            )
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    this.currentOffset =
                        nextOffset;
                },
            });
    }

    getServiceCategoryIcon(
        categoryId: string
    ): string {

        return this.serviceCategoryIcons()
            .get(categoryId) ?? 'handyman';
    }

    retryLoadingCategories(): void {

        this.categoryService
            .loadCategories()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }
}