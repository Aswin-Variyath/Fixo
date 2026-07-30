import { z } from "zod";

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z
            .email("Invalid email address")
            .trim()
            .toLowerCase(),
    }),
});

export type ForgotPasswordInput =
    z.infer<typeof forgotPasswordSchema>["body"];