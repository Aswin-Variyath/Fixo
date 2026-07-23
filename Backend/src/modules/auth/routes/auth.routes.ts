import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {TYPES, container} from "../../../di"
import { validate } from "../../../shared/middlewares/validate.middleware";
import { signupSchema } from "../validations/auth.validation";

const router = Router()

const authController = container.get<AuthController>(TYPES.AuthController)

router.post("/signup",validate(signupSchema),authController.signup)

export default router;