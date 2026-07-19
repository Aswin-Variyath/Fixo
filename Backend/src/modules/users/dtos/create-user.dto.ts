export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string | null;
  roleId: string;
  languageId: string;
  statusId: string;
}