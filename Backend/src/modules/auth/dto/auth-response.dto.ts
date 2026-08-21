export interface SignupResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: {
        type: string;
        title:string;
    }
    language: {
        type: string
        name: string;
    }
    status: {
        type: string;
        title: string;
    }
    createdAt:Date
}

export interface SignupResult {
    user: SignupResponseDto;
    accessToken: string;
    refreshToken: string;
}

export interface LoginUserResponseDto {
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

export interface loginResponseDto {
    user:LoginUserResponseDto
    accessTokenExpiresIn:number
}