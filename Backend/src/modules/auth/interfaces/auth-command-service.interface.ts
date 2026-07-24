import { loginResponseDto, SignupResponseDto } from "../dto/auth-response.dto";
import { LoginDto } from "../dto/login.dto";
import { SignupDto } from "../dto/signup.dto";

export interface LoginResult {
    response:loginResponseDto,
    accessToken: string
    refreshToken:string
}

export interface IAuthCommandService {
    signup(data:SignupDto):Promise<SignupResponseDto>
    login(data:LoginDto):Promise<LoginResult>
}
