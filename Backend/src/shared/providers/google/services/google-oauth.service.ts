import { randomBytes } from "crypto";
import { OAuth2Client } from "google-auth-library";
import { injectable } from "inversify";

import { ENV } from "../../../../config/env.config";
import { redisClient } from "../../../../config/redis.config";

import {
    GoogleUserProfile,
    IGoogleOAuthService,
} from "../interfaces/google-oauth.service.interface";

@injectable()
export class GoogleOAuthService implements IGoogleOAuthService {
    private readonly client: OAuth2Client;

    constructor() {
        this.client = new OAuth2Client(
            ENV.AUTH.GOOGLE.CLIENT_ID,
            ENV.AUTH.GOOGLE.CLIENT_SECRET,
            ENV.AUTH.GOOGLE.CALLBACK_URL
        );
    }

    async getAuthorizationUrl(): Promise<string> {
        const state = randomBytes(32).toString("hex");

        await redisClient.set(
            `google:oauth:state:${state}`,
            "1",
            {
                EX: ENV.AUTH.GOOGLE.STATE_TTL_SECONDS,
            }
        );

        return this.client.generateAuthUrl({
            access_type: "offline",
            scope: [
                "openid",
                "email",
                "profile",
            ],
            prompt: "select_account",
            state,
        });
    }

    async verifyState(state: string): Promise<boolean> {
        const key = `google:oauth:state:${state}`;

        const exists = await redisClient.get(key);

        if (!exists) {
            return false;
        }

        await redisClient.del(key);

        return true;
    }

    async verifyCode(code: string): Promise<GoogleUserProfile> {
        const { tokens } = await this.client.getToken(code);

        if (!tokens.id_token) {
            throw new Error("Google ID token is missing");
        }

        const ticket = await this.client.verifyIdToken({
            idToken: tokens.id_token,
            audience: ENV.AUTH.GOOGLE.CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw new Error("Invalid Google user information");
        }

        if (!payload.sub || !payload.email) {
            throw new Error("Google account information is incomplete");
        }

        return {
            googleId: payload.sub,
            email: payload.email,
            firstName: payload.given_name ?? "",
            lastName: payload.family_name ?? "",
            profileImage: payload.picture ?? null,
        };
    }
}