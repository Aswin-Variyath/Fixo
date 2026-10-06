export interface TaskerSearchSuggestionDto {
    id: string;
    name: string;
}

export interface ServiceSearchSuggestionDto {
    id: string;
    name: string;
}

export interface TaskerSearchSuggestionResponseDto {
    taskers: TaskerSearchSuggestionDto[];
    services: ServiceSearchSuggestionDto[];
}