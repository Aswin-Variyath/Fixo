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
        data.latitude !== undefined && data.longitude !== undefined;

      return hasAddress !== hasCurrentLocation;
    },
    {
      message: "Provide either addressId or both latitude and longitude",
    },
  );

export const nearbyTaskerSchema = z.object({
  query: z
    .object({
      serviceId: z.uuid("Service ID must be a valid UUID").optional(),

      distance: z.coerce
        .number()
        .positive("Distance must be greater than 0")
        .optional(),

      searchId: z.uuid("Search ID must be a valid UUID").optional(),
      sortBy: z.enum(["recommended", "nearest"]).optional(),

      page: z.coerce
        .number()
        .int("Page must be a whole number")
        .positive("Page must be greater than 0")
        .optional(),

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
    .superRefine((data, ctx) => {
      const isExistingSearch = data.searchId !== undefined;

      const isNewSearch =
        data.serviceId !== undefined ||
        data.distance !== undefined ||
        data.sortBy !== undefined ||
        data.addressId !== undefined ||
        data.latitude !== undefined ||
        data.longitude !== undefined;

      if (isExistingSearch && isNewSearch) {
        ctx.addIssue({
          code: "custom",
          message: "Do not provide searchId with new search parameters",
          path: ["searchId"],
        });

        return;
      }

      if (!isExistingSearch) {
        if (!data.serviceId) {
          ctx.addIssue({
            code: "custom",
            message: "Service ID is required",
            path: ["serviceId"],
          });
        }

        if (data.distance === undefined) {
          ctx.addIssue({
            code: "custom",
            message: "Distance is required",
            path: ["distance"],
          });
        }

        const hasAddress = data.addressId !== undefined;

        const hasCurrentLocation =
          data.latitude !== undefined && data.longitude !== undefined;

        if (hasAddress === hasCurrentLocation) {
          ctx.addIssue({
            code: "custom",
            message: "Provide either addressId or both latitude and longitude",
            path: ["addressId"],
          });
        }
      }

      if (isExistingSearch && data.page === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Page is required when using searchId",
          path: ["page"],
        });
      }
    }),
});

export type NearbyTaskerInput = z.infer<typeof nearbyTaskerSchema>["query"];


