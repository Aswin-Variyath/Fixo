export interface customerAddressLocation {
    id:string
    latitude:number
    longitude:number
}

export interface customerAddress {
    id:string
    label:string
    addressLine:string
    city:string
    state:string
    postalCode:string
    country:string
    latitude:number
    longitude:number
    isDefault:boolean
}

export interface ICustomerAddressRepository {
    findLocationByIdAndUserId(addressId:string,userId:string):Promise<customerAddressLocation | null>
    findByUserId(userId:string):Promise<customerAddress[]>
}

