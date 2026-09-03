import { injectable } from "inversify";
import { IMailService } from "../interfaces/mail.service.interface";
import { ENV } from "../../../../config/env.config";
import { passwordResetTemplate } from "../templates/password-reset.template";
import { passwordChangedTemplate } from "../templates/password-changed.template";
import { transporter } from "../../../../config/mail.config";
import { adminOtpTemplate } from "../templates/admin-otp.template";

@injectable()
export class NodemailerMailService  implements IMailService {


   
    async sendPasswordResetEmail(email: string, firstName: string, resetToken: string): Promise<void> {
        
        const html = passwordResetTemplate(firstName,resetToken)
        console.log("Email resendMailservice", email,firstName,resetToken)
        await transporter.sendMail({
            from:ENV.MAIL.FROM,
            to:email,
            subject:"Reset your password",
            html
        })
    }
    
     async sendPasswordChangeEmail(email: string, firstName: string): Promise<void> {
        const html = passwordChangedTemplate(firstName)
        await transporter.sendMail({
            from:ENV.MAIL.FROM,
            to:email,
            subject:"Your password has been changed",
            html
        })
    }
   
    async sendAdminOtp(email: string, firstName: string, otp: string): Promise<void> {
        const html = adminOtpTemplate(firstName,otp)
        await transporter.sendMail({
            from:ENV.MAIL.FROM,
            to:email,
            subject:"Admin login Verification code",
            html
        })
    }
}