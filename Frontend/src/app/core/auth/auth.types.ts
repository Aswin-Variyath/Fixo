export type AuthStatus =
    | 'unknown'
    | 'authenticated'
    | 'unauthenticated';

export type ActiveRole = 'customer' | 'tasker';

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface Role {
    type: ActiveRole;
    title: string;
}

export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: string | null;

    roles: {
        type: string;
        title: string;
    }[];

    activeRole: {
        type: string;
        title: string;
    };

    language: {
        type: string;
        name: string;
    };

    status: {
        type: string;
        title: string;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
    role: ActiveRole;
}

export interface LoginResponse {
    accessTokenExpiresIn: number;
    user: AuthUser;
}

export interface RefreshResponse {
    accessTokenExpiresIn: number;
}
export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

