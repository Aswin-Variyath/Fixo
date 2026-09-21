import { Service, signal } from '@angular/core';
import { SelectedLocation } from '../../addresses/types/customer-address.types';

@Service()
export class LocationContextService {
    private readonly storageKey = 'fixo_customer_location';
    readonly location = signal<SelectedLocation | null>(this.loadLocation())

    hasLocation():boolean {
        return this.location() !== null
    }

setLocation(location:SelectedLocation):void {
    localStorage.setItem(this.storageKey, JSON.stringify(location))
    this.location.set(location)
}

clearLocation():void {
    localStorage.removeItem(this.storageKey)
    this.location.set(null)
}

private loadLocation():SelectedLocation | null {
    const storedLocation = localStorage.getItem(this.storageKey)
    if(!storedLocation) return null
    try {
        return JSON.parse(storedLocation) as SelectedLocation
    } catch (error) {
        localStorage.removeItem(this.storageKey)
        return null
    }
}

}
