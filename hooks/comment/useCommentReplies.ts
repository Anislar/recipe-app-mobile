import { useCallback, useMemo } from "react";
import { commentService } from "@/services/api/comment.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Comment } from "@/type/comment.type";

// Add this new hook in the same file or a separate file
export const useCommentReplies = (
  commentId: string,
  enabled: boolean = true
) => {
  const queryKey = useMemo(() => ["replies", commentId] as const, [commentId]);

  const {
    data: infiniteData,
    isLoading,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
    isFetching,
    isRefetching,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1, signal }) =>
      commentService.getReplies({
        commentId,
        page: pageParam,
        limit: 10,
        signal,
      }),
    getNextPageParam: (lastPage) => {
      if (
        lastPage?.data?.pagination?.page &&
        lastPage?.data?.pagination?.totalPages &&
        lastPage.data.pagination.page < lastPage.data.pagination.totalPages
      ) {
        return lastPage.data.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled,
  });

  const replies: Comment[] = useMemo(() => {
    return infiniteData?.pages.flatMap((page) => page.data.results) ?? [];
  }, [infiniteData]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    replies,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
    isFetching,
    isRefetching,

    refetch,
    loadMore,
  };
};
