import { AuthenticatedUser } from "./authenticated-user.types";

declare global {
    namespace Express { // Declaration merging
        interface Request {
            user?: AuthenticatedUser
        }
    }
}

export {}

