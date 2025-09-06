import { commentService } from "@/services/api/comment.service";
import { postService } from "@/services/api/post.service";
import { Comment } from "@/type/coment.type";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

interface UseCommentOptions {
  postId: string;
  enabled?: boolean;
}

interface CommentMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useComment = ({ postId, enabled }: UseCommentOptions) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ["comments", postId] as const, [postId]);

  const {
    data: infiniteData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1, signal }) =>
      commentService.getComments({
        postId,
        page: pageParam,
        limit: 15,
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

  const comments = useMemo(() => {
    return infiniteData?.pages.flatMap((page) => page.data) ?? [];
  }, [infiniteData]);

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => commentService.addComment(postId, content),
    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        content,
        postId,
        authorId: "current-user", // Get from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: "current-user",
          name: "You",
          avatar: null,
        },
        _count: {
          likes: 0,
          replies: 0,
        },
      };

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any, index: number) => {
            if (index === 0) {
              return {
                ...page,
                data: [optimisticComment, ...page.data],
                total: page.total + 1,
              };
            }
            return page;
          }),
        };
      });

      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => commentService.updateComment(commentId, content),
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((comment: Comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    content,
                    updatedAt: new Date().toISOString(),
                    isEdited: true,
                  }
                : comment
            ),
          })),
        };
      });

      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.filter(
              (comment: Comment) => comment.id !== commentId
            ),
            total: Math.max(0, page.total - 1),
          })),
        };
      });

      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: ({
      commentId,
      isLiked,
    }: {
      commentId: string;
      isLiked: boolean;
    }) => postService.setLike(commentId, {}),
    onMutate: async ({ commentId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((comment: Comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    isLiked: !isLiked,
                    _count: {
                      ...comment._count,
                      likes: isLiked
                        ? Math.max(0, comment._count.likes - 1)
                        : comment._count.likes + 1,
                    },
                  }
                : comment
            ),
          })),
        };
      });

      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
  });

  const addComment = useCallback(
    async (content: string, options?: CommentMutationOptions) => {
      try {
        await addCommentMutation.mutateAsync(content);
        options?.onSuccess?.();
      } catch (error) {
        options?.onError?.(error as Error);
        throw error;
      }
    },
    [addCommentMutation]
  );

  const updateComment = useCallback(
    async (
      commentId: string,
      content: string,
      options?: CommentMutationOptions
    ) => {
      try {
        await updateCommentMutation.mutateAsync({ commentId, content });
        options?.onSuccess?.();
      } catch (error) {
        options?.onError?.(error as Error);
        throw error;
      }
    },
    [updateCommentMutation]
  );

  const deleteComment = useCallback(
    async (commentId: string, options?: CommentMutationOptions) => {
      try {
        await deleteCommentMutation.mutateAsync(commentId);
        options?.onSuccess?.();
      } catch (error) {
        options?.onError?.(error as Error);
        throw error;
      }
    },
    [deleteCommentMutation]
  );

  const toggleLike = useCallback(
    async (commentId: string, isLiked: boolean) => {
      try {
        await toggleLikeMutation.mutateAsync({ commentId, isLiked });
      } catch (error) {
        console.error("Failed to toggle like:", error);
      }
    },
    [toggleLikeMutation]
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    // Data
    comments,

    // Loading states
    isLoading: isLoading && enabled,
    isError,
    error,
    isRefetching,

    // Pagination
    hasNextPage,
    isFetchingNextPage,
    loadMore,

    // Actions
    addComment,
    updateComment,
    deleteComment,
    toggleLike,
    refetch,

    // Mutation states
    isAdding: addCommentMutation.isPending,
    isUpdating: updateCommentMutation.isPending,
    isDeleting: deleteCommentMutation.isPending,
    isTogglingLike: toggleLikeMutation.isPending,

    // Error states
    addError: addCommentMutation.error,
    updateError: updateCommentMutation.error,
    deleteError: deleteCommentMutation.error,
  };
};
