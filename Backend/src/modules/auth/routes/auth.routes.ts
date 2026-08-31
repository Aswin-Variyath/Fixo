import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {TYPES, container} from "../../../di"
import { validate } from "../../../shared/middlewares/validate.middleware";
import { adminLoginSchema, loginSchema, resetPasswordSchema, signupSchema, taskerSignupSchema, verifyAdminOtpSchema } from "../validations/auth.validation";
import { AuthMiddleware } from "../../../shared/middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../../../shared/middlewares/authorization.middleware";
import { forgotPasswordSchema } from "../validations/forgot-password.validation";
import { SwitchRoleSchema } from "../validations/switch-role.validation";

const router = Router();

const authController = container.get<AuthController>(TYPES.AuthController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authorizationMiddleware = container.get<AuthorizationMiddleware>(TYPES.AuthorizationMiddleware)

router.post("/signup",validate(signupSchema),authController.signup)
router.post("/login", validate(loginSchema),authController.login)
router.post("/logout", authController.logout)
router.post("/forgot-password",validate(forgotPasswordSchema),authController.forgotPassword)
router.post("/reset-password",validate(resetPasswordSchema), authController.resetPassword)
router.get("/reset-password",authController.getPasswordResetExpiry)
router.post("/refresh",authController.refresh)

//Tasker side
router.post("/tasker-signup",validate(taskerSignupSchema),authController.taskerSignup)
router.post("/become-customer",authMiddleware.authenticate,authController.becomeCustomer)
router.post("/become-tasker",authMiddleware.authenticate,authController.becomeTasker)

//Both side sharing APIs
router.post("/switch-role",authMiddleware.authenticate,validate(SwitchRoleSchema),authController.switchRole)

// Admin rotues
router.post("/admin-login",validate(adminLoginSchema),authController.adminLogin)
router.post("/verify-otp",validate(verifyAdminOtpSchema),authController.verifyAdminOtp)

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