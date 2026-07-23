import { inject, injectable } from "inversify";
import { IAuthCommandService } from "../interfaces/auth-command-service.interface";
import {TYPES} from "../../../di/identifiers"
import { Response, Request } from "express";
import { SignupDto } from "../dto/signup.dto";
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
}