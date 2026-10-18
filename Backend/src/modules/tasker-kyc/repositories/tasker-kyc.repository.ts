import { injectable } from "inversify";
import { CreateTaskerKycData, CreateTaskerKycDocumentData, ITaskerKycRepository, TaskerKycDocumentRecord, TaskerKycProfileRecord, TaskerKycRecord, UpdateTaskerKycBankDetailsData } from "../interfaces/tasker-kyc-repository.interface";
import { KycDocumentType, TaskerKycStatus } from "../../../database/generated/prisma/enums";
import prisma from "../../../database/prisma/prisma";

@injectable()
export class TaskerKycRepository implements ITaskerKycRepository {
    findKycByTaskerProfileId(taskerProfileId: string): Promise<TaskerKycRecord | null> {
        return prisma.taskerKyc.findUnique({
            where:{taskerProfileId},
            select:{
                id:true,
                taskerProfileId:true,
                status:true,
                createdAt:true,
                updatedAt:true,
                documents:{
                    select: {
                        id:true,
                        type:true,
                        createdAt:true
                    }
                }
            }
        })
    }
    async createKyc(data: CreateTaskerKycData): Promise<void> {
        await prisma.taskerKyc.create({
            data:{
                taskerProfileId:data.taskerProfileId,
                bankAccountNumber:data.encryptedBankAccountNumber,
                ifscCode:data.ifscCode
            }
        })
    }
    async updateKycBankDetails(data: UpdateTaskerKycBankDetailsData): Promise<void> {
        await prisma.taskerKyc.update({
            where:{taskerProfileId:data.taskerProfileId},
            data:{
                bankAccountNumber:data.encryptedBankAccountNumber,
                ifscCode:data.ifscCode
            }
        })
    }
    createKycDocument(data: CreateTaskerKycDocumentData): Promise<TaskerKycDocumentRecord> {
        return prisma.kycDocument.create({
            data:{
                taskerKycId:data.taskerKycId,
                type:data.type as KycDocumentType,
                fileUrl: data.storageReference
            },
            select: {
                id:true,
                type:true,
                createdAt:true
            }
        })
    }
    async updateKycStatus(taskerProfileId: string, status: TaskerKycStatus): Promise<void> {
        await prisma.taskerKyc.update({
            where:{taskerProfileId},
            data:{status}
        })
    }
    async findTaskerProfileByUserId(userId:string):Promise<TaskerKycProfileRecord | null> {
        return prisma.taskerProfile.findUnique({
            where:{userId},
            select:{
                id:true,
                kyc:{
                    select:{
                        id:true,
                        status:true,
                        createdAt:true,
                        updatedAt:true,
                        documents:{
                            select:{
                                id:true,
                                type:true,
                                createdAt:true
                            }
                        }
                    }
                }
            }
        })
    }
    
}