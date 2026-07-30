export interface IMailService {
    sendPasswordResetEmail(email:string,firstName:string,resetToken:string):Promise<void>
    sendPasswordChangeEmail(email:string,firstName:string):Promise<void>
}

