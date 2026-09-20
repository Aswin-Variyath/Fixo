export interface CustomerAddressItem {
    id: string;
    label: string;
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
}

export interface CustomerAddressApiResponse {
    success: boolean;
    message: string;
    data: CustomerAddressItem[]
}

export type LocationContextState =
    | 'loading'
    | 'address-selection'
    | 'location-required'
    | 'error';


export type LocationSource = 'address' | 'gps';

export interface SelectedLocation {
  source: LocationSource;
  addressId?: string;
  latitude?: number;
  longitude?: number;
}