import { z } from "zod";

export const listUsersQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10),

  search: z
    .string()
    .trim()
    .optional(),

  role: z
    .string()
    .trim()
    .optional(),

  status: z
    .string()
    .trim()
    .optional(),

  sortBy: z
    .enum([
      "firstName",
      "email",
      "createdAt",
      "updatedAt",
    ])
    .default("createdAt"),

  sortOrder: z
    .enum([
      "asc",
      "desc",
    ])
    .default("desc"),
});


export const userIdParamSchema = z.object({
  id: z.uuid(),
});