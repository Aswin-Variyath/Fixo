export interface LoginDto {
    email:string
    password:string
    role: 'customer' | 'tasker'
}