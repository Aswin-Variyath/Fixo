export interface ServiceResponseDto {
    id:string
    categoryId:string
    name:string
    slug:string
    description:string
    displayOrder:number
}
 
export interface ServiceCategoryResponseDto {
    id:string
    name:string
    slug:string
    icon:string
    description:string | null
    displayOrder:number
}

export interface ServiceSearchResponseDto {
    services:ServiceResponseDto[]
    categories:ServiceCategoryResponseDto[]
    hasMore:boolean
}