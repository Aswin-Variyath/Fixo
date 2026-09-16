export interface CustomerAddress {
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
    data: {
        addresses: CustomerAddress[];
    };
}