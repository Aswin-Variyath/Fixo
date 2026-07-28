import { TokenFamily } from "../types/auth-session.types";

export interface ITokenFamilyStore {
    create(familyId:string,family:TokenFamily,ttlSeconds:number):Promise<void>
    findById(familyId:string, ): Promise<TokenFamily | null>
    deleteById(familyId:string):Promise<void>
}