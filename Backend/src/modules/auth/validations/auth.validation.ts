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
        password:z.string().min(1,"Password is required"),
        role:z.enum(['customer','tasker'],{error:'Role must be either customer of tasker'})
    })
})
export type loginInput = z.infer<typeof loginSchema>["body"]



export const resetPasswordSchema = z.object({
    body:z.object({
        token:z.string().trim().min(1,"Reset token is required"),
        password:z.string().min(8).max(100,"Password is too long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,"Password must contain uppercase, lowercase, number and special character.")
    })
})



export const taskerSignupSchema = z.object({
    body: z.object({
        firstName: z.string().trim().min(2).max(100),
        lastName: z.string().trim().min(1).max(100),
        email:z.email().trim().lowercase(),
        phone: z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number"),
        password:z.string().min(8,"Password must contain at least 8 characters").max(128)
    })
})
export type TaskerSignupInput = z.infer<typeof taskerSignupSchema>["body"]



export const switchRoleSchema = z.object({
    role:z.enum(['customer','tasker'])
})
export type switchRoleDto = z.infer<typeof switchRoleSchema>




export const adminLoginSchema = z.object({
    body: z.object({
        email: z.email()
            .trim()
            .lowercase(),

        password: z.string()
            .min(1, "Password is required"),
    })
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>["body"];





export const verifyAdminOtpSchema = z.object({
    body: z.object({
        challengeId: z.string()
            .trim()
            .min(1, "Challenge ID is required"),

        otp: z.string()
            .trim()
            .length(6, "OTP must contain exactly 6 digits")
            .regex(/^\d{6}$/, "OTP must contain only digits")
    })
});

export type VerifyAdminOtpInput =
    z.infer<typeof verifyAdminOtpSchema>["body"];