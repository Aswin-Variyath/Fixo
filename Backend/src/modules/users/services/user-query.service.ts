import { inject, injectable } from "inversify";
import { IUserQueryService } from "../interfaces/user-query-service.interface";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { TYPES } from "../../../di";
import { CurrentUser } from "../types/user.types";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";
import { IsessionStore } from "../../auth/interfaces/session-store.interface";


@injectable()
export class UserQueryService implements IUserQueryService {
 constructor(
  @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository, 
  @inject(TYPES.SessionStore) private readonly sessionStore:IsessionStore
) {}

  async getCurrentUser(userId: string, sessionId: string): Promise<CurrentUser> {
    const user = await this.userRepository.findById(userId)
    if(!user) throw new AppError(StatusCodes.NOT_FOUND,"User not found")
    const session = await this.sessionStore.findById(sessionId)
    if(!session) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication session not found")
    if(session.status !== "ACTIVE") throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication session is no longer active")
    if(session.userId !== userId) throw new AppError(StatusCodes.UNAUTHORIZED,"Invalid authentication session")
    const activeRole = user.roles.find((role)=> role.type === session.activeRole)
    if(!activeRole) throw new AppError(StatusCodes.FORBIDDEN,"Active role is no longer available")
    return {...user, activeRole}      
  }
}
