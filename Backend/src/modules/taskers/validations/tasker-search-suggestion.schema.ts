import { z } from "zod";

export const taskerSearchSuggestionSchema = z.object({
    query: z.object({
        query: z
            .string()
            .trim()
            .min(
                2,
                "Search query must be at least 2 characters"
            )
            .max(
                50,
                "Search query cannot exceed 50 characters"
            ),
    }),
});

export type TaskerSearchSuggestionInput =
    z.infer<typeof taskerSearchSuggestionSchema>["query"];