import { z } from "zod";

const locationSchema = z
    .object({
        addressId: z.uuid("Address ID must be a valid UUID").optional(),

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
    .refine(
        (data) => {
            const hasAddress = data.addressId !== undefined;
            const hasCurrentLocation =
                data.latitude !== undefined &&
                data.longitude !== undefined;

            return hasAddress !== hasCurrentLocation;
        },
        {
            message:
                "Provide either addressId or both latitude and longitude",
        }
    );

export const nearbyTaskerSchema = z.object({
    query: z
        .object({
            serviceId: z.uuid("Service ID must be a valid UUID"),
            distance: z.coerce
                .number()
                .positive("Distance must be greater than 0"),
        })
        .and(locationSchema),
});

export type NearbyTaskerInput =
    z.infer<typeof nearbyTaskerSchema>["query"];