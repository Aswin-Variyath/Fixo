import { z } from "zod";

export const SwitchRoleSchema = z.object({
    body: z.object({
        role: z.enum(["customer", "tasker"])
    })
});

export type SwitchRoleDto = z.infer<typeof SwitchRoleSchema>;