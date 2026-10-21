import { z } from "zod";

export const PassbookOcrSchema = z.object({
    file: z.object({
        mimetype: z.enum(["image/jpeg", "image/png", "application/pdf"]),
        size: z
            .number()
            .positive()
            .max(1 * 1024 * 1024, "File size cannot exceed 1 MB"),
    }),
});

export type PassbookOcrDto = z.infer<typeof PassbookOcrSchema>;