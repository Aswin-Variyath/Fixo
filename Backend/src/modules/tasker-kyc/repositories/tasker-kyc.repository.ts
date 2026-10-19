import { injectable } from "inversify";
import { CreateTaskerKycData, CreateTaskerKycDocumentData, ITaskerKycRepository, TaskerKycDocumentRecord, TaskerKycProfileRecord, TaskerKycRecord, TaskerKycSubmissionRecord, UpdateTaskerKycBankDetailsData } from "../interfaces/tasker-kyc-repository.interface";
import { KycDocumentType, TaskerKycStatus } from "../../../database/generated/prisma/enums";
import prisma from "../../../database/prisma/prisma";

@injectable()
export class TaskerKycRepository implements ITaskerKycRepository {
    async findKycSubmissionData(taskerProfileId: string): Promise<TaskerKycSubmissionRecord | null> {
        return prisma.taskerKyc.findUnique({
            where:{taskerProfileId},
            select:{
                id:true,
                taskerProfileId:true,
                bankAccountHolderName:true,
                bankAccountNumber:true,
                ifscCode:true,
                status:true,
                documents:{
                    select:{
                        type:true
                    }
                }
            }
        })
    }
    async submitKyc(taskerProfileId: string): Promise<boolean> {
        const result = await prisma.taskerKyc.updateMany({
            where:{
                taskerProfileId,
                status:{
                    in:[
                        TaskerKycStatus.NOT_SUBMITTED,
                        TaskerKycStatus.REJECTED
                    ]
                }
            },
            data:{
               status:TaskerKycStatus.PENDING 
            }
        })
        return result.count === 1
    }
    async updateCurrentStep(taskerProfileId: string, currentStep: string): Promise<void> {
        await prisma.taskerKyc.update({
            where:{taskerProfileId},
            data:{currentStep}
        })
    }
    findKycByTaskerProfileId(taskerProfileId: string): Promise<TaskerKycRecord | null> {
        return prisma.taskerKyc.findUnique({
            where:{taskerProfileId},
            select:{
                id:true,
                currentStep: true,
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
                bankAccountHolderName: data.bankAccountHolderName,
                bankAccountNumber:data.encryptedBankAccountNumber,
                ifscCode:data.ifscCode
            }
        })
    }
    async updateKycBankDetails(data: UpdateTaskerKycBankDetailsData): Promise<void> {
        await prisma.taskerKyc.update({
            where:{taskerProfileId:data.taskerProfileId},
            data:{
                bankAccountHolderName: data.bankAccountHolderName,
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
                        currentStep: true,
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