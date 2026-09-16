import { Router } from "express";
import { container, TYPES } from "../../../di";
import { CustomerAddressController } from "../controllers/customer-address.controller";
import { AuthMiddleware } from "../../../shared/middlewares/auth.middleware";

const router = Router()

const customerAddressController = container.get<CustomerAddressController>(TYPES.CustomerAddressController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)

router.get("/",authMiddleware.authenticate, customerAddressController.getCustomerAddress)

export default router