export interface CategoryResponseDto {
    id:string
    name:string
    slug:string
    description:string | null
    imageUrl:string | null
    displayOrder:number
}