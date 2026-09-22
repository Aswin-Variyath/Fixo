import { Component, inject, OnInit, output, signal } from '@angular/core';

import { CustomerAddress } from '../../../addresses/services/customer-address';
import { CustomerAddressItem } from '../../../addresses/types/customer-address.types';
import { LocationContextService } from '../../services/location-context-service';
import { SelectedLocation } from '../../types/location.types';

@Component({
  selector: 'app-location-modal',
  imports: [],
  templateUrl: './location-modal.html',
  styleUrl: './location-modal.css',
})
export class LocationModal implements OnInit {
  private readonly customerAddressService = inject(CustomerAddress);
  private readonly customerLocation = inject(LocationContextService);

  readonly locationSelected = output<SelectedLocation>();
  readonly closed = output<void>();

  readonly addresses = signal<CustomerAddressItem[]>([]);
  readonly selectedAddress = signal<CustomerAddressItem | null>(null);
  readonly loading = signal(true);
  readonly locationLoading = signal(false);

  ngOnInit(): void {
    this.loadAddresses();
  }

  private loadAddresses(): void {
    this.loading.set(true);

    this.customerAddressService.getAddress().subscribe({
      next: (response) => {
        const addresses = response.data;

        this.addresses.set(addresses);

        const currentLocation = this.customerLocation.location();

        if (currentLocation?.source === 'address') {
          const matchingAddress = addresses.find(
            (address) => address.id === currentLocation.addressId
          );

          if (matchingAddress) {
            this.selectedAddress.set(matchingAddress);
          }
        }

        if (!this.selectedAddress() && addresses.length > 0) {
          this.selectedAddress.set(addresses[0]);
        }

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load customer addresses', error);
        this.loading.set(false);
      },
    });
  }

  selectAddress(address: CustomerAddressItem): void {
    this.selectedAddress.set(address);
  }

  useCurrentLocation(): void {
    if (!navigator.geolocation) {
      return;
    }

    this.locationLoading.set(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: SelectedLocation = {
          source: 'gps',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        this.customerLocation.setLocation(location);
        this.locationSelected.emit(location);

        this.locationLoading.set(false);
      },
      (error) => {
        console.error('Failed to get current location', error);
        this.locationLoading.set(false);
      }
    );
  }

  confirmLocation(): void {
    const address = this.selectedAddress();

    if (!address) {
      return;
    }

    const location: SelectedLocation = {
      source: 'address',
      addressId: address.id,
      latitude: address.latitude,
      longitude: address.longitude,
    };

    this.customerLocation.setLocation(location);
    this.locationSelected.emit(location);
  }

  close(): void {
    this.closed.emit();
  }
}