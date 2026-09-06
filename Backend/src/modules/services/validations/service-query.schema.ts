import { z } from "zod";

export const serviceQuerySchema = z.object({

    query: z.object({
        categoryId: z
            .uuid("Category ID must be a valid UUID")
            .optional(),

        search: z
            .string()
            .trim()
            .min(1, "Search cannot be empty")
            .max(100, "Search cannot exceed 100 characters")
            .optional(),

        limit: z
            .coerce
            .number()
            .int("Limit must be an integer")
            .min(1, "Limit must be at least 1")
            .max(50, "Limit cannot exceed 50")
            .optional(),

        offset: z
            .coerce
            .number()
            .int("Offset must be an integer")
            .min(0, "Offset cannot be negative")
            .optional(),

    }),

});

export type ServiceQueryInput = z.infer<typeof serviceQuerySchema>["query"];