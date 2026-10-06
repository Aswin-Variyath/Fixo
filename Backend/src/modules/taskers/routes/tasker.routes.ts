import { Router } from "express";
import { container, TYPES } from "../../../di";
import { TaskerController } from "../controllers/tasker.controller";
import { validate } from "../../../shared/middlewares/validate.middleware";
import { nearbyTaskerSchema } from "../validations/nearby-tasker.schema";
import { IAuthMiddleWare } from "../../auth/interfaces/auth-middleware.interface";
import { taskerSearchSuggestionSchema } from "../validations/tasker-search-suggestion.schema";

const router = Router()

const taskerController = container.get<TaskerController>(TYPES.TaskerController)
const AuthMiddleware = container.get<IAuthMiddleWare>(TYPES.AuthMiddleware)
router.get("/search/suggestions",AuthMiddleware.authenticate,validate(taskerSearchSuggestionSchema),taskerController.searchSuggestions)
router.get("/nearby", AuthMiddleware.authenticate,validate(nearbyTaskerSchema), taskerController.searchTaskers)

export default router