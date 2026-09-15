import { injectable } from "inversify";
import { customerAddressLocation, ICustomerAddressRepository } from "../interfaces/customer-address-repository.interface";
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
}