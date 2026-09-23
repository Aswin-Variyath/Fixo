export interface DiscoveryLocationFeatureProperties {
  name: string;
  formatted: string;
  lat: number;
  lon: number;
  country?: string;
  country_code?: string;
  state?: string;
  city?: string;
  result_type?: string;
  place_id?: string;
}

export interface DiscoveryLocationFeature {
  type: 'Feature';
  properties: DiscoveryLocationFeatureProperties;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface DiscoveryLocationAutocompleteResponse {
  type: 'FeatureCollection';
  features: DiscoveryLocationFeature[];
  query: {
    text: string;
    categories: string[];
  };
}

export interface SelectedDiscoveryLocation {
  name: string;
  formatted: string;
  latitude: number;
  longitude: number;
}


export interface DiscoveryReverseGeocodingResult {
  name?: string;
  formatted: string;
  lat: number;
  lon: number;
  city?: string;
  state?: string;
  state_code?: string;
  country?: string;
  country_code?: string;
  postcode?: string;
  result_type?: string;
}

export interface DiscoveryReverseGeocodingResponse {
  results: DiscoveryReverseGeocodingResult[];
}