import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { t } from "i18next";

import { patchQuery } from "@/helpers/patchQuery";
import { showToast } from "@/helpers/toastService";
import { notificationService } from "@/services/api/notification.service";
import { Notification } from "@/type";
import { useNotification } from "@/store";

interface CommentMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useNotificationMutations = (filter: string) => {
  const queryClient = useQueryClient();
  const setNotificationNumber = useNotification(
    (state) => state.setNotificationNumber
  );

  const queryKey = useMemo(() => ["notification", filter] as const, [filter]);

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
      notificationService.getNotifications({
        filter,
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
  });

  const notifications: Notification[] = useMemo(() => {
    return infiniteData?.pages.flatMap((page) => page.data.results) ?? [];
  }, [infiniteData]);

  const size = useMemo(() => {
    return infiniteData?.pages?.[0]?.data?.pagination?.totalItems ?? 0;
  }, [infiniteData]);

  // Update notification count when filter is 'unread'
  useEffect(() => {
    if (!size) return;

    if (filter === "unread") {
      setNotificationNumber(size);
    }
  }, [size, filter, setNotificationNumber]);
  const markedReadMutation = useMutation({
    mutationFn: async (notificationId: number) =>
      await notificationService.markedRead(notificationId),
    onMutate: async (notificationId) => {
      const previousNotification = queryClient.getQueryData(
        queryKey
      ) as unknown as Notification;

      patchQuery<Notification>({
        queryClient,
        key: queryKey as any,
        type: "update",
        matchId: notificationId,
        newItem: (item) => ({
          ...item,
          isRead: true,
        }),
      });
      if (filter === "unread") {
        patchQuery<Notification>({
          queryClient,
          key: queryKey as any,
          type: "delete",
          matchId: notificationId,
        });
      }
      const key = filter === "unread" ? "all" : "unread";

      patchQuery<Notification>({
        queryClient,
        key: ["notification", key],
        type: "update",
        matchId: notificationId,
        newItem: (item) => ({
          ...item,
          isRead: true,
        }),
      });

      return {
        previousNotification,
      };
    },

    onError: (_, __, context) => {
      showToast(t("common.errorApi"));
      if (context?.previousNotification) {
        queryClient.setQueryData(queryKey, context.previousNotification);
      }
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: number) =>
      await notificationService.delete(notificationId),
    onSuccess: (_, variables) => {
      patchQuery<Notification>({
        queryClient,
        key: queryKey as any,
        type: "delete",
        matchId: variables,
      });
    },
    onError: (_) => {
      showToast(t("common.errorApi"));
    },
  });

  const markedRead = useCallback(
    async (notificationId: number, options?: CommentMutationOptions) => {
      try {
        await markedReadMutation.mutateAsync(notificationId);
        options?.onSuccess?.();
      } catch (error) {
        options?.onError?.(error as Error);
        throw error;
      }
    },
    [markedReadMutation]
  );

  const deleteNotification = useCallback(
    async (id: number, options?: CommentMutationOptions) => {
      try {
        await deleteNotificationMutation.mutateAsync(id);
        options?.onSuccess?.();
      } catch (error) {
        options?.onError?.(error as Error);
        throw error;
      }
    },
    [deleteNotificationMutation]
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    // Data
    notifications,
    size,
    // Loading states
    isLoading: isLoading,
    isError,
    error,
    isRefetching,
    isFetching,

    // Pagination
    hasNextPage,
    isFetchingNextPage,
    loadMore,

    // Actions
    markedRead,
    deleteNotification,
    refetch,

    // Mutation states
    isUpdating: markedReadMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,

    // Error states
    updateError: markedReadMutation.error,
    deleteError: deleteNotificationMutation.error,
  };
};
