import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Category } from '../../../home/categories/category.types';

@Component({
    selector: 'app-services-header',
    imports: [
        RouterLink
    ],
    templateUrl: './services-header.html',
    styleUrl: './services-header.css',
})
export class ServicesHeader {
    readonly category = input<Category | null>(null);
    readonly categories = input<Category[]>([]);
}