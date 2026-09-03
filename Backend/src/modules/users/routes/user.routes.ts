import { Router } from "express"
import { container, TYPES } from "../../../di"
import { UserController } from "../controllers/user.controller"
import { AuthMiddleware } from "../../../shared/middlewares/auth.middleware"

const router = Router()

const userController = container.get<UserController>(TYPES.UserController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)

router.get("/me",authMiddleware.authenticate,userController.getCurrentUser)

export default router;