import {
  inject,
  injectable,
} from "inversify";

import type {
  Request,
  Response,
} from "express";

import { TYPES } from "../../../di/identifiers";

import type {
  IUserQueryService,
} from "../interfaces/user-query-service.interface";



import {
  listUsersQuerySchema,
  userIdParamSchema,
} from "../validations/user.validation";

@injectable()
export class UserController {

  constructor(
    @inject(TYPES.UserQueryService)
    private readonly userQueryService: IUserQueryService
  ) {}


  listUsers = async (
  req: Request,
  res: Response
): Promise<void> => {

  const query =
    listUsersQuerySchema.parse(req.query);

  const result =
    await this.userQueryService.listUsers(query);

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: result.users,
    pagination: result.pagination,
  });
};


 getUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {

  const { id } =
    userIdParamSchema.parse(req.params);

  const user =
    await this.userQueryService.getUserDetails(id);

  res.status(200).json({
    success: true,
    message: "User details fetched successfully",
    data: user,
  });
};

}