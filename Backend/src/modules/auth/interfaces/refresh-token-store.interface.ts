import { RefreshTokenRecord } from "../types/auth-session.types";

export type RefreshRotationResult = 
    | {status:"ROTATED"} 
    | {status: "TOKEN_NOT_FOUND"}
    | {status:"TOKEN_REUSED", sessionId:string, familyId:string}
    | {status: "SESSION_INVALID"}
    | {status: "FAMILY_INVALID"}

export interface RotateRefreshTokenData {
    currentTokenHash: string
    newTokenHash: string
    familyId: string
    newTokenExpiresAt: string
    now: string
    ttlSeconds: number
    sessionId: string
}

export interface IRefreshTokenStore {
    create(tokenHash:string,record:RefreshTokenRecord,ttlSeconds:number):Promise<void>
    findByHash(tokenHash:string):Promise<RefreshTokenRecord | null>
    rotate(data:RotateRefreshTokenData):Promise<RefreshRotationResult>
    deleteByHash(sessionId:string):Promise<void>
    revokeByHash(tokenHash:string):Promise<void>
}