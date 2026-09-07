import { Injectable, signal } from '@angular/core';

import { Service, ServiceCategory } from './service.types';

@Injectable()
export class ServiceStore {

    private readonly _services = signal<Service[]>([]);
    private readonly _categories = signal<ServiceCategory[]>([]);
    private readonly _hasMore = signal(false);
    private readonly _isLoading = signal(false);
    private readonly _error = signal<string | null>(null);

    readonly services = this._services.asReadonly();
    readonly categories = this._categories.asReadonly();
    readonly hasMore = this._hasMore.asReadonly();
    readonly isLoading = this._isLoading.asReadonly();
    readonly error = this._error.asReadonly();

    setServices(services: Service[]): void {
        this._services.set(services);
    }

    setCategories(categories: ServiceCategory[]): void {
        this._categories.set(categories);
    }

    setHasMore(hasMore: boolean): void {
        this._hasMore.set(hasMore);
    }

    setLoading(isLoading: boolean): void {
        this._isLoading.set(isLoading);
    }

    setError(error: string | null): void {
        this._error.set(error);
    }

    reset(): void {
        this._services.set([]);
        this._categories.set([]);
        this._hasMore.set(false);
        this._isLoading.set(false);
        this._error.set(null);
    }
}