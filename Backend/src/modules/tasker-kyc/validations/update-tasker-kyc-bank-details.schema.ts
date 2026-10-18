import { z } from "zod";
import { CreateTaskerKycSchema } from "./create-tasker-kyc.schema";

export const UpdateTaskerKycSchema = CreateTaskerKycSchema;

export type UpdateTaskerKycDto = z.infer<typeof UpdateTaskerKycSchema>;