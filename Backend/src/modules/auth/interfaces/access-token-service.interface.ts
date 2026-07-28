export interface AccessTokenPayload {
    userId:string;
    role:string
    sessionId:string
}
export interface IAccessTokenService {
    generate(payload:AccessTokenPayload):string
    verify(token:string):AccessTokenPayload
}