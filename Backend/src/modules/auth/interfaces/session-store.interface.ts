import { AuthSession } from "../types/auth-session.types";

export interface IsessionStore {
    create(sessionId:string, session:AuthSession, ttlSecond:number):Promise<void>
    findById(sessionId:string):Promise<AuthSession | null>
    deleteById(sessionId:string):Promise<void>
    revokeById(sessionId:string):Promise<void>
}