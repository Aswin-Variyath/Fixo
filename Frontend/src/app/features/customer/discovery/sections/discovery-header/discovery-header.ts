import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DiscoveryLocation } from '../../services/discovery-location';
import {
  DiscoveryLocationFeature,
  SelectedDiscoveryLocation,
} from '../../types/discovery-location.types';

@Component({
  selector: 'app-discovery-header',
  imports: [FormsModule],
  templateUrl: './discovery-header.html',
  styleUrl: './discovery-header.css',
})
export class DiscoveryHeader {
  private readonly discoveryLocation = inject(DiscoveryLocation);

  locationText = signal('');
  suggestions = signal<DiscoveryLocationFeature[]>([]);
  selectedLocation = signal<SelectedDiscoveryLocation | null>(null);
  isLoading = signal(false);
  locationError = signal('')

  onLocationInput(value: string): void {
    this.locationText.set(value);

    this.selectedLocation.set(null);

    if (value.trim().length < 2) {
      this.suggestions.set([]);
      return;
    }

    this.isLoading.set(true);

    this.discoveryLocation.autocomplete(value).subscribe({
      next: (response) => {
        this.suggestions.set(response.features);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Location autocomplete failed:', error);

        this.suggestions.set([]);
        this.isLoading.set(false);
      },
    });
  }

  selectLocation(feature: DiscoveryLocationFeature): void {
    const properties = feature.properties;

    const location: SelectedDiscoveryLocation = {
      name: properties.name,
      formatted: properties.formatted,
      latitude: properties.lat,
      longitude: properties.lon,
    };

    this.selectedLocation.set(location);
    this.locationText.set(properties.formatted);
    this.suggestions.set([]);

    console.log('Selected location:', location);
  }

useCurrentLocation(): void {
  this.suggestions.set([]);
  this.locationError.set('');

  if (!navigator.geolocation) {
    this.locationError.set(
      'Location is not supported by your browser.'
    );
    return;
  }

  this.isLoading.set(true);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Store GPS location immediately
      const currentLocation: SelectedDiscoveryLocation = {
        name: 'Current Location',
        formatted: 'Current Location',
        latitude,
        longitude,
      };

      this.selectedLocation.set(currentLocation);
      this.locationText.set('Current Location');

      // Reverse geocode GPS coordinates
      this.discoveryLocation
        .reverseGeocode(latitude, longitude)
        .subscribe({
          next: (response) => {
            const result = response.results[0];

            if (result) {
              const readableLocation: SelectedDiscoveryLocation = {
                name: result.name ?? 'Current Location',
                formatted: result.formatted,
                latitude,
                longitude,
              };

              this.selectedLocation.set(readableLocation);
              this.locationText.set(result.formatted);
            }

            this.isLoading.set(false);

            console.log(
              'Current GPS location:',
              this.selectedLocation()
            );
          },

          error: (error) => {
            console.error(
              'Reverse geocoding failed:',
              error
            );

            // Keep GPS coordinates even if reverse geocoding fails
            this.locationText.set('Current Location');
            this.isLoading.set(false);
          },
        });
    },

    (error) => {
      console.error(
        'Current location failed:',
        error
      );

      this.isLoading.set(false);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.locationError.set(
            'Location permission was denied.'
          );
          break;

        case error.POSITION_UNAVAILABLE:
          this.locationError.set(
            'Current location is unavailable.'
          );
          break;

        case error.TIMEOUT:
          this.locationError.set(
            'Getting your location timed out.'
          );
          break;

        default:
          this.locationError.set(
            'Unable to get your current location.'
          );
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}

}