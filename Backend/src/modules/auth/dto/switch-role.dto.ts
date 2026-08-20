import { ActiveRole } from "../types/auth-session.types";

export interface SwitchRoleDto {
    role: ActiveRole;
}
export interface SwitchRoleResult {
    accessToken:string
    activeRole: {
        type:ActiveRole
        title:string
    }
}