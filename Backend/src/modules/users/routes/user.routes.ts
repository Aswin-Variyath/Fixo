import { Router } from "express"
import { container, TYPES } from "../../../di"
import { UserController } from "../controllers/user.controller"

const router = Router()

const userController = container.get<UserController>(TYPES.UserController)


router.get("/",userController.listUser)

export default router;