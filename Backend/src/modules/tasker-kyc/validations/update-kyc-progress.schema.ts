import { z } from "zod";
import { KYC_WIZARD_STEPS } from "../constants/kyc-wizard-steps";

export const UpdateKycProgressSchema = z.object({
    body: z.object({
        currentStep: z.enum(KYC_WIZARD_STEPS),
    }),
});

export type UpdateKycProgressDto = z.infer<
    typeof UpdateKycProgressSchema
>;