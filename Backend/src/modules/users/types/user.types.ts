export interface UserFromDatabase {
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

    language: {
        type: string;
        name: string;
    };

    status: {
        type: string;
        title: string;
    };
}

export interface CurrentUser extends UserFromDatabase {
    activeRole: {
        type: string;
        title: string;
    };
}