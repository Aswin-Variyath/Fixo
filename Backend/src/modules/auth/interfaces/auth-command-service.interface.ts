import { loginResponseDto, SignupResponseDto } from "../dto/auth-response.dto";
import { LoginDto } from "../dto/login.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { SignupDto } from "../dto/signup.dto";

export interface LoginResult {
    response:loginResponseDto,
    accessToken: string
    refreshToken:string
}

export interface RefreshResult {
    accessToken:string
    refreshToken:string
    accessTokenExpiresIn:number
}


export interface IAuthCommandService {
    signup(data:SignupDto):Promise<SignupResponseDto>
    login(data:LoginDto):Promise<LoginResult>
    refresh(refreshToken:string):Promise<RefreshResult>
    logout(refreshToken:string):Promise<void>
    forgotPassword(email:string):Promise<void>
    resetPassword(data:ResetPasswordDto):Promise<void>
}
