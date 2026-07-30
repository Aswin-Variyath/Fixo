import nodemailer from "nodemailer";
import { ENV } from "./env.config";

export const transporter = nodemailer.createTransport({
    host:ENV.MAIL.SMTP.HOST,
    port:ENV.MAIL.SMTP.PORT,
    secure:false,
    auth:{
        user:ENV.MAIL.SMTP.USER,
        pass:ENV.MAIL.SMTP.PASS
    }
})