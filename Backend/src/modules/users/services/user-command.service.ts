import {
  inject,
  injectable,
} from "inversify";


import type {
  IUserCommandService,
} from "../interfaces/user-command-service.interface";





@injectable()
export class UserCommandService
  implements IUserCommandService {}