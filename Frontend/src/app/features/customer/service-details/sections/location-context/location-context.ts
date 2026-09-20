import { Component, inject, OnInit, output, signal } from '@angular/core';
import {
  CustomerAddressItem,
  LocationContextState,
  SelectedLocation,
} from '../../../addresses/types/customer-address.types';
import { CustomerAddress } from '../../../addresses/services/customer-address';

@Component({
  selector: 'app-location-context',
  imports: [],
  templateUrl: './location-context.html',
  styleUrl: './location-context.css',
})
export class LocationContext implements OnInit {
  private readonly customerAddressService = inject(CustomerAddress);

  readonly locationState = signal<LocationContextState>('loading');

  readonly addresses = signal<CustomerAddressItem[]>([]);
  readonly selectedAddress = signal<CustomerAddressItem | null>(null);

  readonly locationSelected = output<SelectedLocation>();

  ngOnInit(): void {
    this.loadAddresses();
  }

  private loadAddresses(): void {
    this.locationState.set('loading');

    this.customerAddressService.getAddress().subscribe({
      next: (response) => {
        const addresses = response.data;

        this.addresses.set(addresses);

        if (addresses.length === 0) {
          this.locationState.set('location-required');
          return;
        }

        if (addresses.length === 1) {
          this.selectAddress(addresses[0]);
          return;
        }

        this.locationState.set('address-selection');
      },

      error: (error) => {
        console.error(
          'Failed to load customer addresses',
          error
        );

        this.locationState.set('error');
      },
    });
  }

  selectAddress(address: CustomerAddressItem): void {
    this.selectedAddress.set(address);
    this.locationState.set('address-selection');

    this.locationSelected.emit({
      source: 'address',
      addressId: address.id,
      latitude: address.latitude,
      longitude: address.longitude,
    });
  }

  useCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.locationState.set('location-required');
      return;
    }

    this.locationState.set('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.locationSelected.emit({
          source: 'gps',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        this.locationState.set('address-selection');
      },
      (error) => {
        console.error(
          'Failed to get current location',
          error
        );

        this.locationState.set(
          this.addresses().length > 0
            ? 'address-selection'
            : 'location-required'
        );
      }
    );
  }
}