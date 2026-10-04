export interface SearchSuggestionItem {
  id: string;
  name: string;
}

export interface SearchSuggestionData {
  taskers: SearchSuggestionItem[];
  services: SearchSuggestionItem[];
}

export interface SearchSuggestionResponse {
  success: boolean;
  message: string;
  data: SearchSuggestionData;
}