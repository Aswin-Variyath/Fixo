export interface IsessionIndexStore {
    addSession(userId:string, sessionId: string):Promise<void>
    removeSession(userId:string,sessionId:string):Promise<void>
    getSessions(userId:string):Promise<string[]>
    deleteIndex(userId:string):Promise<void>
}