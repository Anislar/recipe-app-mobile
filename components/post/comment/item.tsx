import { Avatar } from "@/components/avatar";
import { Button } from "@/components/UI/button";
import { ContextMenu } from "@/components/UI/context-menu";
import { LoadingSpinner } from "@/components/UI/loading";
import { ModalConfirm } from "@/components/UI/modal-confirm";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { formatTimeAgo } from "@/helpers/utils";
import { ActionType, ActiveAction, Comment } from "@/type/coment.type";
import { Ionicons } from "@expo/vector-icons";
import React, {
  Suspense,
  useCallback,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface CommentItemProps {
  comment: Comment;
  onEdit: (id: string, type: ActionType) => void;
  onDelete: (id: string) => void;
  onLike: (id: string, isLiked: boolean) => void;
  activeAction: ActiveAction | null;
  isUpdating: boolean;
  isAdding: boolean;

  handleActionCancel: () => void;
  handleActionSave: () => void;
  actionContent: string;
  updateActionContent: (text: string) => void;
  isCurrentUser: boolean;
  isDeleting: boolean;
  deleteError: Error | null;
}
// Individual Comment Component
export const CommentItem = React.memo(
  ({
    comment,
    onEdit,
    onDelete,
    onLike,
    activeAction,
    isUpdating,
    isAdding,
    handleActionCancel,
    handleActionSave,
    actionContent,
    updateActionContent,
    isCurrentUser,
    isDeleting,
    deleteError,
  }: CommentItemProps) => {
    const [isModalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
    const { t } = useTranslation();
    const [isPending, startTransition] = useTransition();

    const handleLikePress = useCallback(() => {
      startTransition(() => {
        comment.is_liked = !comment.is_liked;
        comment.likes_count =
          (comment.likes_count || 0) + (comment.is_liked ? 1 : -1);
        onLike(comment?.id, comment.is_liked || false);
      });
    }, [comment, onLike]);

    const handleDeletePress = useCallback(() => {
      setModalDeleteOpen((p) => !p);
    }, []);
    const formattedDate = useMemo(
      () => formatTimeAgo(comment.createdAt!),
      [comment.createdAt] // ,
    );
    const handleDeleteSubmit = useCallback(async () => {
      await onDelete(comment?.id);
      !deleteError && setModalDeleteOpen(false);
    }, [comment?.id, deleteError, onDelete]);
    const renderInput = useCallback(
      (type: ActionType) => (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.actionIput}
            value={actionContent}
            onChangeText={updateActionContent}
            multiline
            placeholder={t(`post.comment.${type}Placeholder`)}
            autoFocus
          />
          <View style={styles.buttonAction}>
            <Button
              title={t("common.cancel")}
              buttonStyle={[
                styles.actionButtons,
                {
                  backgroundColor: "#f5f5f5",
                },
              ]}
              textStyle={{
                color: THEME.colors.darkGray,
              }}
              onPress={handleActionCancel}
            />

            <Button
              buttonStyle={styles.actionButtons}
              onPress={handleActionSave}
              title={t(
                type === "reply" ? "post.comment.replySaveBtn" : "common.save"
              )}
              loading={type === "reply" ? isAdding : isUpdating}
              disabled={
                (type === "reply" ? isAdding : isUpdating) ||
                !actionContent.trim().length
              }
            />
          </View>
        </View>
      ),

      [
        actionContent,
        handleActionCancel,
        handleActionSave,
        isAdding,
        isUpdating,
        t,
        updateActionContent,
      ]
    );
    return (
      <Animated.View
        entering={FadeIn.delay(100)}
        exiting={FadeOut}
        style={[styles.commentItem]}
      >
        {/* Header */}
        <View style={styles.commentHeader}>
          {/* Avatar */}
          <Avatar
            name={comment.user.name}
            uri={comment.user.avatar!}
            size={wp(9)}
            rounded={wp(9)}
          />

          <View style={styles.commentMeta}>
            <Text style={styles.authorName}>{comment.user.name}</Text>
            <Text style={styles.commentTime}>
              {formattedDate}
              {comment.is_edited && " • " + t("post.comment.edited")}
            </Text>
          </View>
          {isCurrentUser && (
            <ContextMenu<"update" | "delete">
              items={[
                {
                  type: "update",
                  name: t("post.action.update"),
                  icon: "pencil-outline",
                },
                {
                  type: "delete",
                  name: t("common.delete"),
                  icon: "trash-can-outline",
                },
              ]}
              onAction={(action) => {
                if (action === "update") {
                  onEdit(comment?.id, "edit");
                } else {
                  handleDeletePress();
                }
              }}
              menuWidth={120}
              left={2}
              top={20}
            />
          )}
        </View>

        {/* Comment Content */}
        {activeAction?.id === comment?.id && activeAction?.type === "edit" ? (
          renderInput("edit")
        ) : (
          <Text style={styles.commentContent}>{comment.content}</Text>
        )}

        {/* Actions */}
        <View style={styles.commentActions}>
          <TouchableOpacity
            disabled={isPending}
            style={styles.actionButton}
            onPress={handleLikePress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={comment.is_liked ? "heart" : "heart-outline"}
              size={16}
              color={comment.is_liked ? "#ff6b6b" : "#666"}
            />
            <Text
              style={[styles.actionText, comment.is_liked && styles.likedText]}
            >
              {comment?.likes_count ?? 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onEdit(comment?.id, "reply")}
            style={styles.actionButton}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#666" />
            <Text style={styles.actionText}>{comment?.replies_count ?? 0}</Text>
          </TouchableOpacity>
        </View>
        {activeAction?.id === comment?.id &&
          activeAction?.type === "reply" &&
          renderInput("reply")}
        {isModalDeleteOpen && (
          <Suspense fallback={<LoadingSpinner />}>
            <ModalConfirm
              isVisible={isModalDeleteOpen}
              isDanger
              isLoading={isDeleting}
              error={deleteError ? deleteError?.message : ""}
              close={() => setModalDeleteOpen(false)}
              onSubmit={handleDeleteSubmit}
            />
          </Suspense>
        )}
      </Animated.View>
    );
  }
);
const styles = StyleSheet.create({
  commentItem: {
    paddingVertical: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: wp(3),
  },

  commentMeta: {
    flex: 1,
  },
  authorName: {
    fontWeight: THEME.fonts.semibold,
    fontSize: 14,
    color: THEME.colors.text,
  },
  commentTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  commentContent: {
    fontSize: hp(1.8),
    color: THEME.colors.text,
    lineHeight: 20,
    marginBottom: 12,
    marginLeft: wp(12),
  },
  inputContainer: {
    marginBottom: 12,
    gap: 5,
  },
  actionIput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonAction: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 5,
  },
  actionButtons: {
    paddingHorizontal: wp(4),
    height: hp(4.5),
    borderRadius: THEME.radius.sm,
  },

  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: wp(2),
    paddingHorizontal: wp(1),
    marginBottom: hp(1),
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  actionText: {
    fontSize: hp(1.4),
    color: THEME.colors.grey2,
  },
  likedText: {
    color: "#ff6b6b",
  },
});
CommentItem.displayName = "CommentItem";
