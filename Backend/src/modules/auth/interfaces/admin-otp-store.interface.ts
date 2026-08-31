export interface AdminOtpData {
    userId: string;
    otpHash: string;
    attempts: number;
    expiresAt: Date;
}

export interface IAdminOtpStore {
    create(challengeId: string, data: AdminOtpData, ttlSeconds: number): Promise<void>;
    findByChallengeId(challengeId: string): Promise<AdminOtpData | null>;
    deleteByChallengeId(challengeId: string): Promise<void>;
    incrementAttempts(challengeId: string): Promise<number>;
}