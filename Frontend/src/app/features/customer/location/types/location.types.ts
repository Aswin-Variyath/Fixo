export type LocationSource = 'address' | 'gps';

export interface SelectedLocation {
  source: LocationSource;
  addressId?: string;
  latitude: number;
  longitude: number;
}