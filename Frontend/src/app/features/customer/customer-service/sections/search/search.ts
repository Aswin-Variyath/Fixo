import { Component, input, output, signal } from '@angular/core';

@Component({
    selector: 'app-search',
    imports: [],
    templateUrl: './search.html',
    styleUrl: './search.css',
})
export class Search {
     readonly placeholder = input(
        'Search services...'
    );

    readonly searchChange = output<string>();

    readonly searchText = signal('');

    onSearch(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = input.value;

        this.searchText.set(value);
        this.searchChange.emit(value);
    }

    clearSearch(input: HTMLInputElement): void {
        input.value = '';

        this.searchText.set('');
        this.searchChange.emit('');
    }
}