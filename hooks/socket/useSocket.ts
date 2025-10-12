import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { patchQuery } from "@/helpers/patchQuery";
import { showToast } from "@/helpers/toastService";
import { Post } from "@/schema/post";
import { socketService } from "@/services/socket.service";
import { useAuthStore, useNotification } from "@/store";
import { Comment } from "@/type";

export const EVENT = {
  LIKE: "like_event",
  COMMENT: "comment_event",
  REPLY: "reply_event",
} as const;
const useSocket = () => {
  const token = useAuthStore((state) => state.token);
  const setNotificationNumber = useNotification(
    (state) => state.setNotificationNumber
  );
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  useEffect(() => {
    if (!token) return;

    // Connect to socket
    socketService.connect(token);

    const handleLikeUpdate = (result: any) => {
      const { targetType, targetId, postId, data } = result;
      if (targetType === "post") {
        patchQuery<Post>({
          queryClient,
          key: ["posts", "general"],
          type: "update",
          newItem: data,
          matchId: targetId,
        });
        patchQuery<Post>({
          queryClient,
          key: ["posts", "general", String(targetId)] as any,
          type: "update_unique",
          matchId: postId,
          newItem: (item) => ({
            ...item,
            like_count: data.likes_count,
            is_liked: data.is_liked,
          }),
        });
      }
      if (targetType === "comment") {
        patchQuery<Comment>({
          queryClient,
          key: ["comments", String(postId)],
          type: "update",
          newItem: data,
          matchId: targetId,
        });
      }

      showToast(
        t(`notification.${data.is_liked ? "like" : "unlike"}.${targetType}`, {
          name: data.actor.name,
        })
      );
      setNotificationNumber((n) => Number(n) + 1);
    };

    // Handle NEW COMMENT event
    const handleNewComment = (result: any) => {
      const { data } = result;

      patchQuery<Post>({
        queryClient,
        key: ["posts", "general", String(data.postId)],
        type: "update_unique",
        matchId: data.postId,
        newItem: (item) => ({
          ...item,
          comment_count: item.comment_count + 1,
        }),
      });
      patchQuery<Comment>({
        queryClient,
        key: ["comments", String(data.postId)],
        type: "add",
        newItem: { ...data, user: data.actor },
      });
      patchQuery<Post>({
        queryClient,
        key: ["posts", "general"],
        type: "update",
        matchId: data.postId,
        newItem: (item) => ({
          ...item,
          comment_count: item.comment_count + 1,
        }),
      });

      showToast(
        t(`notification.comment.new`, {
          name: data.actor.name,
        })
      );
    };

    // Handle NEW REPLY event
    const handleNewReply = (result: any) => {
      const { data } = result;
      patchQuery<Comment>({
        queryClient,
        key: ["comments", String(data.postId)],
        type: "update",
        matchId: data.parent_id,
        newItem: (item) => ({
          ...item,
          replies_count: Number(item.replies_count) + 1,
          replies: [{ ...data, user: data.actor }, ...(item.replies || [])],
        }),
      });
      patchQuery<Comment>({
        queryClient,
        key: ["replies", data.parent_id],
        type: "add",
        newItem: { ...data, user: data.actor },
      });
      showToast(
        t(`notification.reply.new`, {
          name: data.actor.name,
        })
      );
    };

    // Register listeners
    socketService.on(EVENT.LIKE, handleLikeUpdate);
    socketService.on(EVENT.COMMENT, handleNewComment);
    socketService.on(EVENT.REPLY, handleNewReply);

    // Cleanup
    return () => {
      socketService.off(EVENT.LIKE, handleLikeUpdate);
      socketService.off(EVENT.COMMENT, handleNewComment);
      socketService.off(EVENT.REPLY, handleNewReply);
      socketService.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, queryClient]);
};

export default useSocket;
