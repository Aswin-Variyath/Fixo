import { inject, injectable } from "inversify";
import { IAuthCommandService } from "../interfaces/auth-command-service.interface";
import {TYPES} from "../../../di/identifiers"
import { Response, Request, NextFunction } from "express";
import { SignupDto } from "../dto/signup.dto";
import { LoginDto } from "../dto/login.dto";
import { ENV } from "../../../config/env.config";
import { ForgotPasswordDto } from "../dto/forgot-password.dto";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../../../shared/utils/response.util";
import { HttpResponse } from "../../../shared/constants";
import { TaskerSignupDto } from "../dto/tasker-signup.dt0";

@injectable()
export class AuthController {
    constructor(@inject(TYPES.AuthCommandService) private readonly authCommandService: IAuthCommandService) {}
    
    signup = async(req: Request<Record<string,never>,unknown, SignupDto>, res: Response):Promise<void> => {
        const result = await this.authCommandService.signup(req.body)
        res.cookie("accessToken",result.accessToken,{
            httpOnly:true,
            secure:ENV.APP.NODE_ENV === "production",
            sameSite:'lax',
            maxAge:ENV.AUTH.TOKEN.ACCESS_TTL_SECONDS * 1000
        })
        res.cookie("refreshToken",result.refreshToken,{
            httpOnly:true,
            secure:ENV.APP.NODE_ENV === "production",
            sameSite:"lax",
            maxAge:ENV.AUTH.TOKEN.REFRESH_TTL_SECONDS * 1000
        })
        res.status(StatusCodes.CREATED).json(successResponse(HttpResponse.AUTH.SIGNUP_SUCCESS,result.user))
    }
    login = async(req:Request<Record<string,never>, unknown, LoginDto>, res:Response):Promise<void> =>{
        
        const result = await this.authCommandService.login(req.body)
        res.cookie(
            "accessToken", 
            result.accessToken,
            {
                httpOnly:true,
                secure:ENV.APP.NODE_ENV === "production",
                sameSite:"lax",
                maxAge:ENV.AUTH.TOKEN.ACCESS_TTL_SECONDS * 1000
            }
        )
        res.cookie(
            "refreshToken",
            result.refreshToken,
            {
                httpOnly:true,
                secure:ENV.APP.NODE_ENV === "production",
                sameSite:"lax",
                maxAge:ENV.AUTH.TOKEN.REFRESH_TTL_SECONDS * 1000
            }
        )
        res.status(StatusCodes.OK).json(successResponse(HttpResponse.AUTH.LOGIN_SUCCESS,result.response))
    }

    refresh = async(req:Request, res: Response):Promise<void> => {
        const refreshToken = req.cookies?.refreshToken

        if(!refreshToken || typeof refreshToken !== "string") throw new AppError(401, "Invalid or expired authentication session")
        
        const result = await this.authCommandService.refresh(refreshToken)

        res.cookie("accessToken",result.accessToken, {
            httpOnly:true,
            secure:ENV.APP.NODE_ENV === "production",
            sameSite:"lax",
            maxAge:ENV.AUTH.TOKEN.ACCESS_TTL_SECONDS * 1000
        })

        res.cookie("refreshToken",result.refreshToken,{
            httpOnly:true,
            secure:ENV.APP.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: ENV.AUTH.TOKEN.REFRESH_TTL_SECONDS * 1000
        })

        res.status(StatusCodes.OK).json(successResponse(HttpResponse.AUTH.TOKEN_REFRESH_SUCCESS, {accessTokenExpiresIn: result.accessTokenExpiresIn}))
    }

    logout = async(req:Request, res:Response, next: NextFunction):Promise<void> => {
        const refreshToken = req.cookies?.refreshToken

        if(!refreshToken || typeof refreshToken !== "string") throw new AppError(401, "Refresh token is missing")
        
        await this.authCommandService.logout(refreshToken)

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        res.status(StatusCodes.OK).json(successResponse(HttpResponse.AUTH.LOGOUT_SUCCESS))
    }

    forgotPassword = async(req:Request<Record<string, never>, unknown, ForgotPasswordDto>, res:Response):Promise<void> =>{
        await this.authCommandService.forgotPassword(req.body.email);
        res.status(StatusCodes.OK).json(successResponse(HttpResponse.AUTH.PASSWORD_RESET_EMAIL_SENT))
    }

    resetPassword = async(req:Request, res: Response):Promise<void> =>{
        await this.authCommandService.resetPassword(req.body)
        res.status(StatusCodes.OK).json(successResponse(HttpResponse.AUTH.PASSWORD_RESET_SUCCESS))
    }

    taskerSignup = async(req:Request<Record<string, never>, unknown, TaskerSignupDto>, res:Response):Promise<void> => {
        const user = await this.authCommandService.taskerSignup(req.body)
        res.status(StatusCodes.CREATED).json(successResponse(HttpResponse.AUTH.SIGNUP_SUCCESS,user))
    }

    becomeCustomer = async(req:Request,res:Response):Promise<void> => {
        if(!req.user) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication required")
        await this.authCommandService.becomeCustomer(req.user.userId)
        res.status(StatusCodes.OK).json(successResponse("Customer role addedd successfully"))
    }

    becomeTasker = async(req:Request, res:Response):Promise<void> => {
        if(!req.user) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication required")
        await this.authCommandService.becomeTasker(req.user.userId)
        res.status(StatusCodes.OK).json(successResponse("Tasker Role added successfully"))
    }

    switchRole = async (req: Request,res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const sessionId = req.user?.sessionId;

    if (!userId || !sessionId) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication information is missing")
    
    const result = await this.authCommandService.switchRole(userId,sessionId,req.body.role)

    res.cookie(
        "accessToken",
        result.accessToken,
        {
            httpOnly: true,
            secure: ENV.APP.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: ENV.AUTH.TOKEN.ACCESS_TTL_SECONDS * 1000
        }
    )

    res.status(StatusCodes.OK).json(successResponse("Role switched successfully",{activeRole: result.activeRole}))
};
}