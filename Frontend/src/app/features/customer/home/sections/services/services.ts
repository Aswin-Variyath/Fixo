import {
    Component,
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

import { CategoryService } from '../../categories/category.service';
import { CategoryStore } from '../../categories/category.store';
import { ServiceApi } from '../../services/service-api';
import { ServiceService } from '../../services/service.service';
import { ServiceStore } from '../../services/service.store';

@Component({
    selector: 'app-services',
    imports: [],
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

    readonly categories = this.categoryService.categories;
    readonly isLoading = this.categoryService.isLoading;
    readonly error = this.categoryService.error;

    readonly services = this.serviceService.services;
    readonly searchCategories = this.serviceService.categories;
    readonly isSearching = this.serviceService.isLoading;
    readonly searchError = this.serviceService.error;

    readonly searchText = signal('');

    ngOnInit(): void {
        this.categoryService.loadCategories().subscribe();

        this.searchSubject
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                filter((searchText) => searchText.length > 0),
                switchMap((searchText) =>
                    this.serviceService.searchServices(searchText)
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    onSearch(searchText: string): void {
        const trimmedSearchText = searchText.trim();

        this.searchText.set(searchText);
        this.searchSubject.next(trimmedSearchText);
    }

    retryLoadingCategories(): void {
        this.categoryService.loadCategories().subscribe();
    }
}