export interface customerAddressLocation {
    id:string
    latitude:number
    longitude:number
}

export interface ICustomerAddressRepository {
    findLocationByIdAndUserId(addressId:string,userId:string):Promise<customerAddressLocation | null>
}