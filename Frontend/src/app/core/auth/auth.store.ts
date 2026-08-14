import { computed, Injectable, signal } from "@angular/core"
import { AuthStatus, AuthUser } from "./auth.types"

@Injectable({
    providedIn:'root'
})
export class AuthStore {
    private readonly _status = signal<AuthStatus>('unknown')
    private readonly _user = signal<AuthUser | null>(null)

    readonly status = this._status.asReadonly()
    readonly user = this._user.asReadonly()

    readonly isAuthenticated = computed(()=> this._status() === 'authenticated')

    readonly isLoading = computed(()=>this._status() === 'unknown')

    setUnauthenticated():void {
        this._user.set(null)
        this._status.set('unathenticated')
    }

    setAuthenticated(user:AuthUser):void {
        this._user.set(user)
        this._status.set('authenticated')
    }

    reset():void {
        this._user.set(null)
        this._status.set('unknown')
    }

}