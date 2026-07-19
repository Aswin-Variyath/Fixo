import {
  inject,
  injectable,
} from "inversify";

import bcrypt from "bcrypt";

import { TYPES } from "../../../di/identifiers";

import type {
  IUserRepository,
} from "../interfaces/user-repository.interface";

import type {
  IUserCommandService,
} from "../interfaces/user-command-service.interface";

import type {
  CreateUserDto,
} from "../dtos/create-user.dto";

import type {
  UpdateUserDto,
} from "../dtos/update-user.dto";

import type {
  UserSafeData,
} from "../types/user.types";

import {
  NotFoundError,
} from "../../../shared/errors/not-found.error";

import {
  ConflictError,
} from "../../../shared/errors/conflict.error";


@injectable()
export class UserCommandService
  implements IUserCommandService {

  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}


  async createUser(
    data: CreateUserDto
  ): Promise<UserSafeData> {

    const existingEmail =
      await this.userRepository.findByEmail(
        data.email
      );


    if (existingEmail) {

      throw new ConflictError(
        "Email already exists"
      );

    }


    const existingPhone =
      await this.userRepository.findByPhone(
        data.phone
      );


    if (existingPhone) {

      throw new ConflictError(
        "Phone number already exists"
      );

    }


    const hashedPassword =
      await bcrypt.hash(
        data.password,
        12
      );


    return this.userRepository.create({
      ...data,

      password: hashedPassword,
    });
  }


  async updateUser(
    id: string,
    data: UpdateUserDto
  ): Promise<UserSafeData> {

    const existingUser =
      await this.userRepository.findById(id);


    if (!existingUser) {

      throw new NotFoundError(
        "User not found"
      );

    }


    if (data.email) {

      const emailUser =
        await this.userRepository.findByEmail(
          data.email
        );


      if (
        emailUser &&
        emailUser.id !== id
      ) {

        throw new ConflictError(
          "Email already exists"
        );

      }

    }


    if (data.phone) {

      const phoneUser =
        await this.userRepository.findByPhone(
          data.phone
        );


      if (
        phoneUser &&
        phoneUser.id !== id
      ) {

        throw new ConflictError(
          "Phone number already exists"
        );

      }

    }


    return this.userRepository.update(
      id,
      data
    );
  }


  async softDeleteUser(
    id: string
  ): Promise<void> {

    const existingUser =
      await this.userRepository.findById(id);


    if (!existingUser) {

      throw new NotFoundError(
        "User not found"
      );

    }


    await this.userRepository.softDelete(id);

  }

}