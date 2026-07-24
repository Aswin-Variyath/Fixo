import {email, z} from 'zod'
export const signupSchema = z.object({
    body: z.object({
        firstName:z.string().trim().min(2).max(100),
        lastName: z.string().trim().min(1).max(100),
        email:z.email().trim().lowercase(),
        phone:z.string().trim().regex(/^\+?[1-9]\d{7,14}$/,"Invalid phone number"),
        password:z.string().min(8,"Password must contain at least 8 characters").max(128)
    })
})
export type SignupInput = z.infer<typeof signupSchema>["body"]

export const loginSchema = z.object({
    body:z.object({
        email:z.email().trim().toLowerCase(),
        password:z.string().min(1,"Password is required")
    })
})
export type loginInput = z.infer<typeof loginSchema>["body"]