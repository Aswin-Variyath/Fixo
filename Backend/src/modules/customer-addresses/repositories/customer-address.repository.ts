import { injectable } from "inversify";
import { customerAddress, customerAddressLocation, ICustomerAddressRepository } from "../interfaces/customer-address-repository.interface";
import prisma from "../../../database/prisma/prisma";

@injectable()
export class CustomerAddressRepository implements ICustomerAddressRepository {
    async findLocationByIdAndUserId(addressId: string, userId: string): Promise<customerAddressLocation | null> {
        const address = await prisma.customerAddress.findFirst({
            where:{
                id:addressId,
                userId

            },
            select:{
                id:true,
                latitude:true,
                longitude:true
            }
        })
        if(!address) {
            return null
        }
        return {
            id:address.id,
            latitude:Number(address.latitude),
            longitude:Number(address.longitude)
        }
    }

    async findByUserId(userId: string): Promise<customerAddress[]> {
        const addresses = await prisma.customerAddress.findMany({
            where:{
                userId
            },
            select:{
                id:true,
                label:true,
                addressLine:true,
                city:true,
                state:true,
                postalCode:true,
                country:true,
                latitude:true,
                longitude:true,
                isDefault:true
            },
            orderBy:[
                {
                    isDefault:'desc'
                },
                {
                    createdAt:'desc'
                }
            ]
        })
        return addresses.map((address)=>({
            id:address.id,
            label:address.label,
            addressLine: address.addressLine,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            latitude: Number(address.latitude),
            longitude: Number(address.longitude),
            isDefault: address.isDefault,
        }))
    }
}