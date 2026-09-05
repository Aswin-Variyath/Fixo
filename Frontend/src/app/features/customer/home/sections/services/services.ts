import { Component, inject, OnInit } from '@angular/core';

import { CategoryService } from '../../categories/category.service';
import { CategoryStore } from '../../categories/category.store';

@Component({
    selector: 'app-services',
    imports: [],
    providers: [CategoryService, CategoryStore],
    templateUrl: './services.html',
    styleUrl: './services.css',
})
export class Services implements OnInit {
  private readonly categoryService = inject(CategoryService);

    readonly categories = this.categoryService.categories;
    readonly isLoading = this.categoryService.isLoading;
    readonly error = this.categoryService.error;

    ngOnInit(): void {
        this.categoryService.loadCategories().subscribe();
    }

    retryLoadingCategories(): void {
        this.categoryService.loadCategories().subscribe();
    }
}