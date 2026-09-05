import { Injectable, signal } from "@angular/core";
import { Category } from "./category.types";

@Injectable()
export class CategoryStore {

    private readonly _categories = signal<Category[]>([])
    private readonly _isLoading = signal(false)
    private readonly _error = signal<string | null>(null)

    readonly categories = this._categories.asReadonly()
    readonly isLoading = this._isLoading.asReadonly()
    readonly error = this._error.asReadonly()

    setCategories(categories:Category[]):void {
        this._categories.set(categories)
    }

    setLoading(isLoading:boolean):void {
        this._isLoading.set(isLoading)
    }

    setError(error:string | null):void {
        this._error.set(error)
    }

    reset():void {
        this._categories.set([])
        this._isLoading.set(false)
        this._error.set(null)
    }

}