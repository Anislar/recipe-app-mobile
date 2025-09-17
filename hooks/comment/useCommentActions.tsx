import { Comment } from "@/type/coment.type";
import { useCallback, useState } from "react";

interface UseCommentActionsProps {
  comments: Comment[];
  updateComment: (id: string, content: string) => Promise<void>;
  toggleLike: (id: string, isLiked: boolean) => Promise<void>;
  userId: string | undefined;
}

export const useCommentActions = ({
  comments,
  updateComment,
  toggleLike,
  userId,
}: UseCommentActionsProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const handleEditStart = useCallback(
    (commentId: string) => {
      const comment = comments.find((c) => c.id === commentId);
      if (comment) {
        setEditingId(commentId);
        setEditContent(comment.content || "");
      }
    },
    [comments]
  );

  const handleEditSave = useCallback(async () => {
    if (!editingId || !editContent.trim()) return;

    await updateComment(editingId, editContent.trim());
    setEditingId(null);
    setEditContent("");
  }, [editingId, editContent, updateComment]);

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
    setEditContent("");
  }, []);

  const handleLike = useCallback(
    async (commentId: string, isLiked: boolean) => {
      await toggleLike(commentId, isLiked);
    },
    [toggleLike]
  );

  const isCurrentUser = useCallback(
    (comment: Comment) => {
      return comment?.user.id === userId;
    },
    [userId]
  );

  return {
    editingId,
    editContent,
    setEditContent,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
    handleLike,
    isCurrentUser,
  };
};
