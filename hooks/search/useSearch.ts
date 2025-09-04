import { postService } from "@/services/api/post.service";
import { ActiveFilters, SearchResult } from "@/type";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "../useDebounce";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
  SUCCESS: "success",
} as const;
type StatusType = (typeof STATUS)[keyof typeof STATUS];

export const useSearch = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [status, setStatus] = useState<{
    state: StatusType;
    message: string;
  }>({ state: STATUS.IDLE, message: "" });
  const debounceSearch = useDebounce(searchText, 350);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: null,
    dateRange: null,
    hashtag: null,
    location: null,
  });
  const filterCount = useMemo(
    (): number => Object.values(activeFilters).filter((v) => v !== null).length,
    [activeFilters]
  );

  const clearAllFilters = useCallback((): void => {
    setActiveFilters({
      category: null,
      dateRange: null,
      hashtag: null,
      location: null,
    });
  }, []);

  const setFilter = useCallback(
    (filterType: keyof ActiveFilters, value: string): void => {
      setActiveFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }));
    },
    []
  );

  const onChangeSearch = useCallback((text: string): void => {
    setSearchText(text);
  }, []);

  const handleSearch = useCallback(
    async (signal: AbortSignal) => {
      if (searchText.length === 0) {
        setSearchResult(null);
        return;
      }
      if (debounceSearch.length < 3 && filterCount === 0) {
        setSearchResult(null);
        return;
      }
      setStatus({ state: STATUS.LOADING, message: "" });
      try {
        const res = await postService.search(
          {
            q: debounceSearch,
            category: activeFilters?.category!,
            dateRange: activeFilters?.dateRange!,
            location: activeFilters?.location!,
            hashtag: activeFilters?.hashtag!,
          },
          signal
        );
        setSearchResult(res.data as SearchResult);
        setStatus({ state: STATUS.SUCCESS, message: "" });
      } catch (error: Error | any) {
        if (error.message === "canceled") {
          setStatus({
            state: STATUS.IDLE,
            message: error?.message,
          });
          return;
        }
        setStatus({
          state: STATUS.ERROR,
          message: error?.message,
        });
      }
    },
    [
      searchText,
      debounceSearch,
      filterCount,
      activeFilters?.category,
      activeFilters?.dateRange,
      activeFilters?.hashtag,
      activeFilters?.location,
    ]
  );

  const refetch = useCallback((): void => {
    const abort = new AbortController();
    handleSearch(abort.signal);
  }, [handleSearch]);

  // handle search filter
  useEffect(() => {
    const abort = new AbortController();
    handleSearch(abort.signal);
    return () => {
      abort.abort();
    };
  }, [handleSearch]);

  return {
    onChangeSearch,
    setFilter,
    clearAllFilters,
    refetch,
    searchText,
    status,
    filterCount,
    searchResult,
    activeFilters,
  };
};
