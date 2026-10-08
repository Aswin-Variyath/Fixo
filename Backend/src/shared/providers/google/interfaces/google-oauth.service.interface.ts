export type GoogleAuthRole = "customer" | "tasker";

export interface GoogleUserProfile {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
}

export interface IGoogleOAuthService {
    getAuthorizationUrl(role: GoogleAuthRole): Promise<string>;
    verifyState(state: string): Promise<GoogleAuthRole | null>;
    verifyCode(code: string): Promise<GoogleUserProfile>;
}