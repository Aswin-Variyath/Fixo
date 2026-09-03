export interface IRateLimitStore {
    exists(key:string): Promise<boolean>
    set(key:string,ttlSeconds:number):Promise<void>
    delete(key:string):Promise<void>
}
