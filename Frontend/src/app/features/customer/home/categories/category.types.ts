export interface Category {
    id:string
    name:string
    slug:string
    icon: string
    description:string | null
    imageUrl:string | null
    displayOrder: number
}

export interface CategoryApiResponse {
    success:boolean
    message:string
    data: Category[]
}