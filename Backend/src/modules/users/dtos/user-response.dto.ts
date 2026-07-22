export interface UserRoleResponseDto {
    type: string;
    title: string;
}

export interface UserLanguageResponseDto {
    type: string;
    name: string;
}

export interface UserStatusResponseDto {
    type: string;
    title: string;
    colorCode: string | null;
}

export interface UserListItemResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: string | null;
    role: UserRoleResponseDto;
    language: UserLanguageResponseDto;
    status: UserStatusResponseDto;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
