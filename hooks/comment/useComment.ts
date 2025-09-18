import { showToast } from "@/helpers/toastService";
import { patchQuery } from "@/helpers/patchQuery";
import { Post } from "@/schema/post";
import { commentService } from "@/services/api/comment.service";
import { postService } from "@/services/api/post.service";
import { useAuthStore } from "@/store";
import { LikeTargetType } from "@/type";
import { Comment } from "@/type/coment.type";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { t } from "i18next";
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
  const user = useAuthStore((state) => state.user);
  const queryKey = useMemo(() => ["comments", postId] as const, [postId]);
  const queryPostUniqueKey = useMemo(
    () => ["posts", "general", postId] as const,
    [postId]
  );
  const queryPostKey = useMemo(() => ["posts", "general"] as const, []);
  const {
    data: infiniteData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    isFetching,
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
    return infiniteData?.pages.flatMap((page) => page.data.results) ?? [];
  }, [infiniteData]);

  const size = useMemo(() => {
    return infiniteData?.pages?.[0]?.data?.pagination?.totalItems ?? 0;
  }, [infiniteData]);

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await commentService.addComment(postId, {
        content,
      });
      return res.data;
    },
    onSuccess: async (data) => {
      const previousData = queryClient.getQueryData(queryKey);
      const newComment = {
        ...data,
        user: user!,
      };
      patchQuery<Comment>({
        queryClient,
        key: queryKey as any,
        type: "add",
        newItem: newComment,
      });
      patchQuery<Post>({
        queryClient,
        key: queryPostUniqueKey as any,
        type: "update_unique",
        matchId: data.postId,
        newItem: (item) => ({
          ...item,
          comment_count: item.comment_count + 1,
        }),
      });
      patchQuery<Post>({
        queryClient,
        key: queryPostKey as any,
        type: "update",
        matchId: data.postId,
        newItem: (item) => ({
          ...item,
          comment_count: item.comment_count + 1,
        }),
      });
      return { previousData };
    },
    onError: (_, __, context) => {
      showToast(t("common.errorApi"));
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => commentService.updateComment(commentId, { content }),
    onSuccess: (response, { commentId }) => {
      patchQuery<Comment>({
        queryClient,
        key: queryKey as any,
        type: "update",
        newItem: response.data,
        matchId: commentId,
      });
    },
    onError: (_) => {
      showToast(t("common.errorApi"));
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) =>
      await commentService.deleteComment(commentId),
    onSuccess: (response) => {
      patchQuery<Comment>({
        queryClient,
        key: queryKey as any,
        type: "delete",
        matchId: response.data.comment_id,
      });
      patchQuery<Post>({
        queryClient,
        key: queryPostKey as any,
        type: "update",
        matchId: response.data.post_id,
        newItem: (item) => ({
          ...item,
          comment_count: item.comment_count - 1,
        }),
      });
      patchQuery<Post>({
        queryClient,
        key: queryPostUniqueKey as any,
        type: "update_unique",
        matchId: response.data.post_id,
        newItem: (item) => ({
          ...item,
          comment_count: item.comment_count - 1,
        }),
      });
    },
    onError: (_) => {
      showToast(t("common.errorApi"));
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async ({
      commentId,
      isLiked,
    }: {
      commentId: string;
      isLiked: boolean;
    }) =>
      await commentService.setLike(commentId, {
        target_type: LikeTargetType.COMMENT,
      }),
    onSuccess: async (response) => {
      patchQuery<Comment>({
        queryClient,
        key: queryKey as any,
        type: "update",
        newItem: response.data,
        matchId: response.data.id,
      });
    },
    onError: (_) => {
      showToast(t("common.errorApi"));
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
    size,
    // Loading states
    isLoading: isLoading && enabled,
    isError,
    error,
    isRefetching,
    isFetching,

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
