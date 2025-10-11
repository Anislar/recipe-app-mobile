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

    const handleLikeUpdate = (data: any) => {
      const { target_type, targetId, postId } = data;

      if (target_type === "post") {
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
      if (target_type === "comment") {
        patchQuery<Comment>({
          queryClient,
          key: ["comments", String(postId)],
          type: "update",
          newItem: data,
          matchId: targetId,
        });
      }
      showToast(
        t(`notification.${data.is_liked ? "like" : "unlike"}.${target_type}`, {
          name: data.user.name,
        })
      );
      setNotificationNumber((n) => n + 1);
    };

    // Handle NEW COMMENT event
    const handleNewComment = (data: any) => {
      console.log("💬 New comment:", data);
      const { post_id } = data;

      queryClient.invalidateQueries({ queryKey: ["comments", post_id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({
        queryKey: ["posts", "general", post_id],
      });
    };

    // Handle NEW REPLY event
    const handleNewReply = (data: any) => {
      console.log("💭 New reply:", data);
      const { comment_id } = data;

      queryClient.invalidateQueries({ queryKey: ["replies", comment_id] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
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
  }, [token, queryClient]);
};

export default useSocket;
