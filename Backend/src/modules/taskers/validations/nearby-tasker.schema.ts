import { z } from "zod";

export const nearbyTaskerSchema = z.object({

    query: z.object({
        serviceId: z
            .uuid("Service ID must be a valid UUID"),

        latitude: z
            .coerce
            .number()
            .min(-90, "Latitude must be between -90 and 90")
            .max(90, "Latitude must be between -90 and 90"),

        longitude: z
            .coerce
            .number()
            .min(-180, "Longitude must be between -180 and 180")
            .max(180, "Longitude must be between -180 and 180"),

        distance: z
            .coerce
            .number()
            .positive("Distance must be greater than 0"),

    }),

});

export type NearbyTaskerInput =
    z.infer<typeof nearbyTaskerSchema>["query"];