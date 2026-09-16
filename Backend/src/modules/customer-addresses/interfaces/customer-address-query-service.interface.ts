import { customerAddress } from "./customer-address-repository.interface";
export interface ICustomerAddressQueryService {
    getCustomerAddressess(userId:string):Promise<customerAddress[]>
}