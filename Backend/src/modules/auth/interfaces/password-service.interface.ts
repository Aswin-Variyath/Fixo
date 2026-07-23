export interface IPasswordService {
    hash(password:string):Promise<string>;
    verify(password:string, plainPassword:string):Promise<boolean>
}