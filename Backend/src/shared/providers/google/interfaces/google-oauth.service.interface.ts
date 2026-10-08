export interface GoogleUserProfile {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
}

export interface IGoogleOAuthService {
    getAuthorizationUrl(): Promise<string>;
    verifyState(state: string): Promise<boolean>;
    verifyCode(code: string): Promise<GoogleUserProfile>;
}