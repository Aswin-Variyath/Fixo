export interface UserRoleResponseDto {
    id: string;
    type: string;
    tittle: string;
    isSuper: string;
}

export interface UserLanguageResponseDto {
    id: string;
    type: string;
    name: string;
}

export interface userStatusResponseDto {
    id:string;
    type:string;
    title: string;
    colorCode: string;
}

export interface UserResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone:string;
    profileImage: string | null;
    role: UserLanguageResponseDto
    language: UserLanguageResponseDto
    status: UserRoleResponseDto
    lastLogin: Date | null
    createdAt: Date;
    updatedAt: Date;
}