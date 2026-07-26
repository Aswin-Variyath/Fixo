import { inject, injectable } from "inversify";
import { IAuthCommandService } from "../interfaces/auth-command-service.interface";
import {TYPES} from "../../../di/identifiers"
import { Response, Request } from "express";
import { SignupDto } from "../dto/signup.dto";
import { LoginDto } from "../dto/login.dto";
import { ENV } from "../../../config/env.config";
import { InvalidRefreshTokenError } from "../../../shared/errors/invalid-refresh-token.error";

@injectable()
export class AuthController {
    constructor(@inject(TYPES.AuthCommandService) private readonly authCommandService: IAuthCommandService) {}
    
    signup = async(req: Request<Record<string,never>,unknown, SignupDto>, res: Response):Promise<void> => {
        console.log("COntroller hits")
        const user = await this.authCommandService.signup(req.body);
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:user
        })
    }
    login = async(req:Request<Record<string,never>, unknown, LoginDto>, res:Response):Promise<void> =>{
        console.log("Hit login controller");
        
        const result = await this.authCommandService.login(req.body)
        console.log("after authcommand service")
        res.cookie(
            "accessToken", 
            result.accessToken,
            {
                httpOnly:true,
                secure:ENV.NODE_ENV === "production",
                sameSite:"lax",
                maxAge:ENV.JWT.accessTokenTtlSeconds * 1000
            }
        )
        console.log("After access token creation")
        res.cookie(
            "refreshToken",
            result.refreshToken,
            {
                httpOnly:true,
                secure:ENV.NODE_ENV === "production",
                sameSite:"lax",
                maxAge:ENV.AUTH.refreshTokenTtlSeconds * 1000
            }
        )
        res.status(200).json({
            success:true,
            message:"Login successfull",
            data:result.response
        })
        console.log("After refresh token creation")
    }

    refresh = async(req:Request, res: Response):Promise<void> => {
        const refreshToken = req.cookies?.refreshToken

        if(!refreshToken || typeof refreshToken !== "string") throw new InvalidRefreshTokenError()
        
        const result = await this.authCommandService.refresh(refreshToken)

        res.cookie("accessToken",result.accessToken, {
            httpOnly:true,
            secure:ENV.NODE_ENV === "production",
            sameSite:"lax",
            maxAge:ENV.JWT.accessTokenTtlSeconds * 1000
        })

        res.cookie("refreshToken",result.refreshToken,{
            httpOnly:true,
            secure:ENV.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: ENV.AUTH.refreshTokenTtlSeconds * 1000
        })

        res.status(200).json({
            success:true,
            message: "Token refreshed Succesfully",
            data: {
                accessTokenExpiresIn: result.accessTokenExpiresIn
            }
        })
    }

}