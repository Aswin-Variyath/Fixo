export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?:string;
    phone?:string;
    profileImage?:string | null;
    roleId?:string;
    languageId?: string;
    statusId?:string;
}