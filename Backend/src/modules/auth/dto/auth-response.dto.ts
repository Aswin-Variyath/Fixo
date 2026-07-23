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