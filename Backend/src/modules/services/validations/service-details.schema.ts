import z from "zod";

export const serviceDetailsSchema  = z.object({
    params:z.object({
        serviceId:z.uuid("Service ID must be a valid UUID")
    })
})