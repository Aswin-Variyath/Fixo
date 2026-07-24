import { RefreshTokenRecord } from "../types/auth-session.types";

export interface IRefreshTokenStore {
    create(tokenHash:string,record:RefreshTokenRecord,ttlSeconds:number):Promise<void>
    findByHash(tokenHash:string):Promise<RefreshTokenRecord | null>
}