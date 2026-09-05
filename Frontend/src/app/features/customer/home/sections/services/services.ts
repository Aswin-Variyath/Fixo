import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../categories/category.service';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit{
  private readonly categoryService = inject(CategoryService)

  readonly catgories = this.categoryService.categories
  readonly isLoading = this.categoryService.isLoading
  readonly error = this.categoryService.error
  ngOnInit(): void {
    this.categoryService.loadCategories().subscribe()
  }
}
