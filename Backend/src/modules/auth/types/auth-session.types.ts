export type SessionStatus = "ACTIVE" | "REVOKED"
export type TokenFamilyStatus = "ACTIVE" | "REVOKED"
export type RefreshTokenStatus = "ACTIVE" | "USED" | "REVOKED"
export interface AuthSession {
    userId:string
    familyId:string
    status:SessionStatus
    createdAt:string
    expiresAt:string
    lastUsedAt:string | null
} 

export interface TokenFamily {
    sessionId:string
    status:TokenFamilyStatus

}

export interface RefreshTokenRecord {
    sessionId: string;
    familyId:string;
    status: RefreshTokenStatus
    expiresAt:string
    replacedByHash:string | null
}