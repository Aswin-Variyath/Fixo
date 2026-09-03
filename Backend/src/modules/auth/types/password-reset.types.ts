// Used when creating a password reset token
export interface CreatePasswordResetTokenData {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
}

// Used when reading a password reset token with user details
export interface PasswordResetTokenRecord {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
    user: {
        email: string;
        firstName: string;
    };
}