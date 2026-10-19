import { Router } from "express";
import { container, TYPES } from "../../../di";
import { TaskerKycController } from "../controllers/tasker-kyc.controller";
import { IAuthMiddleWare } from "../../auth/interfaces/auth-middleware.interface";
import { validate } from "../../../shared/middlewares/validate.middleware";
import { CreateTaskerKycSchema } from "../validations/create-tasker-kyc.schema";
import { UpdateTaskerKycSchema } from "../validations/update-tasker-kyc-bank-details.schema";
import { kycUpload } from "../../../shared/middlewares/kyc-upload.middleware";
import { UploadTaskerKycDocumentSchema } from "../validations/upload-tasker-kyc-document.schema";

const router = Router();

const taskerKycController = container.get<TaskerKycController>(TYPES.TaskerKycController)
const authMiddleware = container.get<IAuthMiddleWare>(TYPES.AuthMiddleware)

router.post("/",authMiddleware.authenticate,validate(CreateTaskerKycSchema),taskerKycController.createKyc)
router.patch("/bank-details",authMiddleware.authenticate,validate(UpdateTaskerKycSchema),taskerKycController.updateBankDetails)
router.post("/documents",authMiddleware.authenticate, kycUpload,validate(UploadTaskerKycDocumentSchema),taskerKycController.uploadDocument)
router.get("/",authMiddleware.authenticate,taskerKycController.getKycDetails)

export default router;