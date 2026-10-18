import { KycDocumentType } from "../../../database/generated/prisma/enums";

export interface UploadTaskerKycDocumentDto {
    type: KycDocumentType;
}