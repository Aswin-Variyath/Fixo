import { z } from "zod";
import { KycDocumentType } from "../../../database/generated/prisma/enums";

export const UploadTaskerKycDocumentSchema = z.object({
    body: z.object({
        type: z.nativeEnum(KycDocumentType),
    }),
});

export type UploadTaskerKycDocumentDto = z.infer<
    typeof UploadTaskerKycDocumentSchema
>;