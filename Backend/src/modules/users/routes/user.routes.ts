import {
  Router,
} from "express";

import { container } from "../../../di/container";
import { TYPES } from "../../../di/identifiers";

import {
  UserController,
} from "../controllers/user.controller";

import {
  validateParams,
  validateQuery,
} from "../../../shared/middlewares/validate.middleware";

import {
  listUsersQuerySchema,
  userIdParamSchema,
} from "../validations/user.validation";


const router = Router();


const userController =
  container.get<UserController>(
    TYPES.UserController
  );


router.get(
  "/",
  validateQuery(listUsersQuerySchema),
  userController.listUsers
);


router.get(
  "/:id",
  validateParams(userIdParamSchema),
  userController.getUserDetails
);


export default router;