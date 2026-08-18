import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {TYPES, container} from "../../../di"
import { validate } from "../../../shared/middlewares/validate.middleware";
import { loginSchema, resetPasswordSchema, signupSchema, taskerSignupSchema } from "../validations/auth.validation";
import { AuthMiddleware } from "../../../shared/middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../../../shared/middlewares/authorization.middleware";
import { forgotPasswordSchema } from "../validations/forgot-password.validation";

const router = Router();

const authController = container.get<AuthController>(TYPES.AuthController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authorizationMiddleware = container.get<AuthorizationMiddleware>(TYPES.AuthorizationMiddleware)

router.post("/signup",validate(signupSchema),authController.signup)
router.post("/login", validate(loginSchema),authController.login)
router.post("/logout", authController.logout)
router.post("/forgot-password",validate(forgotPasswordSchema),authController.forgotPassword)
router.post("/reset-password",validate(resetPasswordSchema), authController.resetPassword)
router.post("/refresh",authController.refresh)

//Tasker side
router.post("/tasker-sigup",validate(taskerSignupSchema),authController.taskerSignup)
router.post("/become-customer",authMiddleware.authenticate,authController.becomeCustomer)
router.post("/become-tasker",authMiddleware.authenticate,authController.becomeTasker)

// test api =======
router.get("/admin-test",authMiddleware.authenticate,authorizationMiddleware.authorize("admin"),(req,res)=>{
    res.json({
        message:"Welcome Admin",
        user: req.user
    })
})

router.get("/costumer-test", authMiddleware.authenticate,authorizationMiddleware.authorize("customer"),(req,res)=>{
    res.json({
        message:"Welcome customer",
        user:req.user
    })
})
// test api =====
export default router;