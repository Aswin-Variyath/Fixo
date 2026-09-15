import { Router } from "express";
import { container, TYPES } from "../../../di";
import { TaskerController } from "../controllers/tasker.controller";
import { validate } from "../../../shared/middlewares/validate.middleware";
import { nearbyTaskerSchema } from "../validations/nearby-tasker.schema";

const router = Router()

const taskerController = container.get<TaskerController>(TYPES.TaskerController)

router.get("/nearby", validate(nearbyTaskerSchema), taskerController.getNearbyTasker)

export default router