import { injectable } from "inversify";
import { IMailService } from "../interfaces/mail.service.interface";
import { Resend } from "resend";
import { ENV } from "../../../config/env.config";
import { passwordResetTemplate } from "../templates/password-reset.template";
import { passwordChangedTemplate } from "../templates/password-changed.template";

@injectable()
export class ResendMailService  implements IMailService {

    private readonly resend: Resend

    constructor(){ this.resend = new Resend(ENV.MAIL.RESEND_API_KEY)}
   
    async sendPasswordResetEmail(email: string, firstName: string, resetToken: string): Promise<void> {
        const html = passwordResetTemplate(firstName,resetToken)

        await this.resend.emails.send({
            from:ENV.MAIL.MAIL_FROM,
            to:email,
            subject: "Reset you password",
            html
        })
    }
    
     async sendPasswordChangeEmail(email: string, firstName: string): Promise<void> {
        const html = passwordChangedTemplate(firstName)
        await this.resend.emails.send({
            from:ENV.MAIL.MAIL_FROM,
            to:email,
            subject:"Your password has been changed",
            html
        })
    }
   

}