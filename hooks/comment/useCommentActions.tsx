import { useAuthStore } from "@/store";
import { ActionType, ActiveAction, Comment } from "@/type/coment.type";
import { useCallback, useState } from "react";

interface UseCommentActionsProps {
  comments: Comment[];
  updateComment: (id: string, content: string) => Promise<void>;
  toggleLike: (id: string, isLiked: boolean) => Promise<void>;
  addReply: (content: string, parent_id?: string) => Promise<boolean>;
}
export const useCommentActions = ({
  comments,
  updateComment,
  toggleLike,
  addReply,
}: UseCommentActionsProps) => {
  const userId = useAuthStore((state) => state.user?.id);

  const [activeAction, setActiveAction] = useState<ActiveAction | null>(null);

  const handleActionStart = useCallback(
    (commentId: string, type: ActionType) => {
      if (type === "edit") {
        const comment = comments.find((c) => c.id === commentId);
        if (comment) {
          setActiveAction({
            id: commentId,
            type,
            content: comment.content || "",
          });
        }
      }
      if (type === "reply") {
        setActiveAction({
          id: commentId,
          type,
          content: "",
        });
      }
    },
    [comments]
  );

  const handleActionSave = useCallback(async () => {
    if (!activeAction || !activeAction.content.trim()) return;

    try {
      if (activeAction.type === "edit") {
        await updateComment(activeAction.id, activeAction.content.trim());
      }
      if (activeAction.type === "reply") {
        await addReply(activeAction.content.trim(), String(activeAction.id));
      }
      setActiveAction(null);
    } catch (error) {
      console.error(`Failed to ${activeAction.type} comment:`, error);
    }
  }, [activeAction, updateComment, addReply]);

  const handleActionCancel = useCallback(() => {
    setActiveAction(null);
  }, []);

  const updateActionContent = useCallback((content: string) => {
    setActiveAction((prev) => (prev ? { ...prev, content } : null));
  }, []);

  const handleLike = useCallback(
    async (commentId: string, isLiked: boolean) => {
      await toggleLike(commentId, isLiked);
    },
    [toggleLike]
  );

  const isCurrentUser = useCallback(
    (comment: Comment) => {
      return comment?.user?.id === userId;
    },
    [userId]
  );

  const isActiveAction = useCallback(
    (commentId: string, type?: ActionType) => {
      if (!activeAction || activeAction.id !== commentId) return false;
      return type ? activeAction.type === type : true;
    },
    [activeAction]
  );

  return {
    // Active action state
    activeAction,
    actionContent: activeAction?.content || "",

    // Generic action handlers
    handleActionStart,
    handleActionSave,
    handleActionCancel,
    updateActionContent,
    isActiveAction,
    // Other handlers
    handleLike,
    isCurrentUser,
  };
};
