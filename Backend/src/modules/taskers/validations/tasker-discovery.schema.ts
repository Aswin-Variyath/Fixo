import { z } from "zod";

export const taskerDiscoverySchema = z.object({
    query: z
        .object({
            distance: z.coerce
                .number()
                .positive("Distance must be greater than 0")
                .optional(),

            searchId: z
                .string()
                .uuid("Invalid search ID")
                .optional(),

            sortBy: z
                .enum([
                    "recommended",
                    "nearest",
                    "highestRated",
                    "lowestPrice",
                ])
                .optional(),

            page: z.coerce
                .number()
                .int()
                .positive("Page must be greater than 0")
                .optional(),

            addressId: z
                .string()
                .uuid("Invalid address ID")
                .optional(),

            latitude: z.coerce
                .number()
                .min(-90)
                .max(90)
                .optional(),

            longitude: z.coerce
                .number()
                .min(-180)
                .max(180)
                .optional(),
        })
        .superRefine((data, ctx) => {
            if (data.searchId) {
                if (
                    data.distance !== undefined ||
                    data.addressId !== undefined ||
                    data.latitude !== undefined ||
                    data.longitude !== undefined ||
                    data.sortBy !== undefined
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message:
                            "Search ID cannot be used with new search parameters",
                        path: ["searchId"],
                    });
                }

                if (data.page === undefined) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Page is required",
                        path: ["page"],
                    });
                }

                return;
            }

            if (data.distance === undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Distance is required",
                    path: ["distance"],
                });
            }

            const hasAddress = data.addressId !== undefined;

            const hasCoordinates =
                data.latitude !== undefined &&
                data.longitude !== undefined;

            if (!hasAddress && !hasCoordinates) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Either address ID or latitude and longitude are required",
                    path: ["addressId"],
                });
            }

            if (hasAddress && hasCoordinates) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Provide either address ID or latitude and longitude, not both",
                    path: ["addressId"],
                });
            }
        }),
});

export type TaskerDiscoveryInput = z.infer<typeof taskerDiscoverySchema>;

export type TaskerDiscoveryQuery =
    z.infer<typeof taskerDiscoverySchema>["query"];
