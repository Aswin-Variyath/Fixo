import { TaskerKycProfileRecord } from "./tasker-kyc-repository.interface";

export interface ITaskerKycQueryService {
    getKycDetails(userId:string):Promise<TaskerKycProfileRecord>
}