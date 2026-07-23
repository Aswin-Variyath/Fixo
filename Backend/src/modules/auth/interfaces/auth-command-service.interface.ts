import { SignupResponseDto } from "../dto/auth-response.dto";
import { SignupDto } from "../dto/signup.dto";

export interface IAuthCommandService {
    signup(data:SignupDto):Promise<SignupResponseDto>
}