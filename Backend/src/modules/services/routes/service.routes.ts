import { Router } from "express";
import { container, TYPES } from "../../../di";
import { ServiceController } from "../controllers/service.controller";
import { validate } from "../../../shared/middlewares/validate.middleware";
import { serviceQuerySchema } from "../validations/service-query.schema";
import { serviceDetailsSchema } from "../validations/service-details.schema";

const router = Router()

const serviceController = container.get<ServiceController>(TYPES.ServiceController)

router.get("/",validate(serviceQuerySchema),serviceController.getServices)
router.get("/:serviceId",validate(serviceDetailsSchema),serviceController.getServiceById)

export default router