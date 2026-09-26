import { z } from "zod";

export const nearbyTaskerSchema = z.object({
    query: z
        .object({
            serviceId: z
                .uuid("Service ID must be a valid UUID")
                .optional(),

            distance: z.coerce
                .number()
                .positive("Distance must be greater than 0")
                .optional(),

            searchId: z
                .uuid("Search ID must be a valid UUID")
                .optional(),

            sortBy: z
                .enum([
                    "recommended",
                    "nearest",
                    "highestRated",
                    "lowestPrice",
                ])
                .optional(),

            requestedDate: z.coerce
                .date()
                .optional(),

            requestedTime: z
                .string()
                .regex(
                    /^([01]\d|2[0-3]):([0-5]\d)$/,
                    "Requested time must be in HH:mm format",
                )
                .optional(),

            page: z.coerce
                .number()
                .int("Page must be a whole number")
                .positive("Page must be greater than 0")
                .optional(),

            addressId: z
                .uuid("Address ID must be a valid UUID")
                .optional(),

            latitude: z.coerce
                .number()
                .min(-90, "Latitude must be between -90 and 90")
                .max(90, "Latitude must be between -90 and 90")
                .optional(),

            longitude: z.coerce
                .number()
                .min(-180, "Longitude must be between -180 and 180")
                .max(180, "Longitude must be between -180 and 180")
                .optional(),
        })
        .superRefine((data, ctx) => {
            const isExistingSearch =
                data.searchId !== undefined;

            const hasNewSearchParameters =
                data.serviceId !== undefined ||
                data.distance !== undefined ||
                data.sortBy !== undefined ||
                data.requestedDate !== undefined ||
                data.requestedTime !== undefined ||
                data.addressId !== undefined ||
                data.latitude !== undefined ||
                data.longitude !== undefined;

            /*
             * Existing search
             */
            if (isExistingSearch) {
                if (hasNewSearchParameters) {
                    ctx.addIssue({
                        code: "custom",
                        message:
                            "Do not provide searchId with new search parameters",
                        path: ["searchId"],
                    });
                }

                if (data.page === undefined) {
                    ctx.addIssue({
                        code: "custom",
                        message:
                            "Page is required when using searchId",
                        path: ["page"],
                    });
                }

                return;
            }

            /*
             * New search
             */
            if (data.distance === undefined) {
                ctx.addIssue({
                    code: "custom",
                    message: "Distance is required",
                    path: ["distance"],
                });
            }

            /*
             * Location validation
             */
            const hasAddress =
                data.addressId !== undefined;

            const hasCoordinates =
                data.latitude !== undefined &&
                data.longitude !== undefined;

            if (hasAddress === hasCoordinates) {
                ctx.addIssue({
                    code: "custom",
                    message:
                        "Provide either addressId or both latitude and longitude",
                    path: ["addressId"],
                });
            }

            /*
             * requestedDate and requestedTime
             * must be provided together.
             */
            const hasRequestedDate =
                data.requestedDate !== undefined;

            const hasRequestedTime =
                data.requestedTime !== undefined;

            if (
                hasRequestedDate !== hasRequestedTime
            ) {
                ctx.addIssue({
                    code: "custom",
                    message:
                        "requestedDate and requestedTime must be provided together",
                    path: ["requestedDate"],
                });
            }
        }),
});

export type NearbyTaskerInput =
    z.infer<typeof nearbyTaskerSchema>["query"];