import { Avatar } from "@/components/avatar";
import { Button } from "@/components/UI/button";
import { ContextMenu } from "@/components/UI/context-menu";
import { LoadingSpinner } from "@/components/UI/loading";
import { ModalConfirm } from "@/components/UI/modal-confirm";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { formatDate, formatTimeAgo } from "@/helpers/utils";
import { Comment } from "@/type/coment.type";
import { Ionicons } from "@expo/vector-icons";
import React, { Suspense, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface CommentItemProps {
  comment: Comment;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onLike: (id: string, isLiked: boolean) => void;
  isEditing: boolean;
  isUpdating: boolean;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  editContent: string;
  onEditContentChange: (text: string) => void;
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
    isEditing,
    isUpdating,
    onCancelEdit,
    onSaveEdit,
    editContent,
    onEditContentChange,
    isCurrentUser,
    isDeleting,
    deleteError,
  }: CommentItemProps) => {
    const [isModalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
    const scaleValue = useSharedValue(1);
    const { t } = useTranslation();
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleValue.value }],
    }));

    const handleLikePress = useCallback(() => {
      scaleValue.value = withSpring(0.95, {}, () => {
        scaleValue.value = withSpring(1);
      });
      onLike(comment?.id, comment.is_liked || false);
    }, [comment?.id, comment.is_liked, onLike, scaleValue]);

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
    return (
      <Animated.View
        entering={FadeIn.delay(100)}
        exiting={FadeOut}
        style={[styles.commentItem]}
      >
        {/* Avatar */}
        <View style={styles.commentHeader}>
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
                  onEdit(comment?.id);
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
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[styles.editInput]}
              value={editContent}
              onChangeText={onEditContentChange}
              multiline
              placeholder="Edit your comment..."
              autoFocus
            />
            <View style={styles.editActions}>
              <Button
                title={t("common.cancel")}
                buttonStyle={[
                  styles.editButton,
                  {
                    backgroundColor: "#f5f5f5",
                  },
                ]}
                textStyle={{
                  color: THEME.colors.darkGray,
                }}
                onPress={onCancelEdit}
              />

              <Button
                buttonStyle={styles.editButton}
                onPress={onSaveEdit}
                title={t("common.save")}
                loading={isUpdating}
                disabled={isUpdating}
              />
            </View>
          </View>
        ) : (
          <Text style={styles.commentContent}>{comment.content}</Text>
        )}

        {/* Actions */}
        <View style={styles.commentActions}>
          <Animated.View style={animatedStyle}>
            <TouchableOpacity
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
                style={[
                  styles.actionText,
                  comment.is_liked && styles.likedText,
                ]}
              >
                {comment?.likes_count ?? 0}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={16} color="#666" />
            <Text style={styles.actionText}>{t("post.comment.reply")} </Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 5,
  },

  commentMeta: {
    flex: 1,
  },
  authorName: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  commentTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  commentContent: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
    marginBottom: 12,
  },
  editContainer: {
    marginBottom: 12,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: "top",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 8,
  },
  editButton: {
    paddingHorizontal: wp(4),
    height: hp(5.5),
    borderRadius: THEME.radius.sm,
  },

  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    color: "#666",
  },
  likedText: {
    color: "#ff6b6b",
  },
});
CommentItem.displayName = "CommentItem";
