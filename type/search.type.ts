import { Post } from "@/schema/post";

interface ActiveFilters {
  category: string | null;
  dateRange: string | null;
  hashtag: string | null;
  location: string | null;
}

interface FilterChipProps {
  label: string;
  filterType: keyof ActiveFilters;
  value: string;
  isActive: boolean;
  onPress: (filterType: keyof ActiveFilters, value: string) => void;
}

interface SearchResult {
  pagination: {
    hasNext: boolean;
    hasPrev: boolean;
    page: number;
    totalItems: number;
    totalPages: number;
  };
  hashtags: string[];
  posts: Post[];
  searchMeta: {
    executionTime: number;
    fromCache: boolean;
    query: string;
    resultsFound: number;
  };
}
export { FilterChipProps, ActiveFilters, SearchResult };
