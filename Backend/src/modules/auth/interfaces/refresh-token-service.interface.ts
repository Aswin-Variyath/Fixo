export interface RefreshTokenResult {
    token: string;
    tokenHash: string
}

export interface IRefreshTokenService {
    generate():RefreshTokenResult;
    hash(token:string):string
}