export interface OpaqueTokenResult  {
    token: string;
    tokenHash: string
}

export interface IOpaqueTokenService {
    generate():OpaqueTokenResult ;
    hash(token:string):string
    generateOtp():string
}