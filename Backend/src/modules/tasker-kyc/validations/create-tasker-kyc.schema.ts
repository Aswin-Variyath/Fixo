import { z } from "zod";

export const CreateTaskerKycSchema = z.object({
    body: z.object({
        bankAccountNumber: z
            .string()
            .trim()
            .regex(/^\d{9,18}$/, "Bank account number must contain 9–18 digits"),
        bankAccountHolderName: z.string().trim().min(2, "Account holder name must contain at least 2 characters").max(100, "Account holder name cannot exceed 100 characters"),
        ifscCode: z
            .string()
            .trim()
            .toUpperCase()
            .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
    }),
});

export type CreateTaskerKycDto = z.infer<typeof CreateTaskerKycSchema>;