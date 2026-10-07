export interface GoogleUserProfile {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
}

export interface IGoogleOAuthService {
    getAuthorizationUrl(): string;
    verifyCode(code: string): Promise<GoogleUserProfile>;
}