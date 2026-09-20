import { inject, injectable } from "inversify";
import { ICustomerAddressQueryService } from "../interfaces/customer-address-query-service.interface";
import { TYPES } from "../../../di";
import { customerAddress, ICustomerAddressRepository } from "../interfaces/customer-address-repository.interface";

@injectable()
export class CustomerAddressQueryService implements ICustomerAddressQueryService {
    constructor(
        @inject(TYPES.CustomerAddressRepository) private readonly customerAddressRepository: ICustomerAddressRepository
    ) {}

    async getCustomerAddressess(userId: string): Promise<customerAddress[]> {
        return this.customerAddressRepository.findByUserId(userId)
    }
}