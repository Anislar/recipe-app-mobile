import { Comment } from "@/type/coment.type";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
  Alert,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label.charAt(0)} ago`;
    }
  }

  return "just now";
};
// Individual Comment Component
export const CommentItem = React.memo(
  ({
    comment,
    onEdit,
    onDelete,
    onLike,
    isEditing,
    onCancelEdit,
    onSaveEdit,
    editContent,
    onEditContentChange,
    isCurrentUser,
  }: {
    comment: Comment;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onLike: (id: string, isLiked: boolean) => void;
    isEditing: boolean;
    onCancelEdit: () => void;
    onSaveEdit: () => void;
    editContent: string;
    onEditContentChange: (text: string) => void;
    isCurrentUser: boolean;
  }) => {
    const scaleValue = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleValue.value }],
    }));

    const handleLikePress = useCallback(() => {
      scaleValue.value = withSpring(0.95, {}, () => {
        scaleValue.value = withSpring(1);
      });
      onLike(comment.id, comment.isLiked || false);
    }, [comment.id, comment.isLiked, onLike, scaleValue]);

    const handleDeletePress = useCallback(() => {
      Alert.alert(
        "Delete Comment",
        "Are you sure you want to delete this comment?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => onDelete(comment.id),
          },
        ]
      );
    }, [comment.id, onDelete]);

    return (
      <Animated.View
        entering={FadeIn.delay(100)}
        exiting={FadeOut}
        style={[styles.commentItem]}
      >
        {/* Avatar & Author */}
        <View style={styles.commentHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {comment.author.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.commentMeta}>
            <Text style={styles.authorName}>{comment.author.name}</Text>
            <Text style={styles.commentTime}>
              {formatTimeAgo(comment.createdAt)}
              {comment.isEdited && " • edited"}
            </Text>
          </View>
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
              <TouchableOpacity
                style={[styles.editButton, styles.cancelButton]}
                onPress={onCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, styles.saveButton]}
                onPress={onSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.commentContent}>{comment.content}</Text>
        )}

        {/* Actions */}
        <View style={styles.commentActions}>
          <Animated.View style={animatedStyle}>
            <TouchableOpacity
              style={[styles.actionButton, styles.likeButton]}
              onPress={handleLikePress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={comment.isLiked ? "heart" : "heart-outline"}
                size={16}
                color={comment.isLiked ? "#ff6b6b" : "#666"}
              />
              <Text
                style={[styles.actionText, comment.isLiked && styles.likedText]}
              >
                {comment._count.likes}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={16} color="#666" />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>

          {true && (
            <View style={styles.ownerActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEdit(comment.id)}
              >
                <Ionicons name="create-outline" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDeletePress}
              >
                <Ionicons name="trash-outline" size={16} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    );
  }
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerWeb: {
    maxWidth: 800,
    alignSelf: "center" as const,
    width: "100%",
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#333",
  },
  expandButton: {
    padding: 8,
  },
  listContent: {
    paddingVertical: 8,
  },
  commentItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  commentItemWeb: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  commentHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "600" as const,
    fontSize: 16,
  },
  commentMeta: {
    flex: 1,
  },
  authorName: {
    fontWeight: "600" as const,
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
    textAlignVertical: "top" as const,
  },
  editInputWeb: {
    outlineStyle: "none" as any,
  },
  editActions: {
    flexDirection: "row" as const,
    justifyContent: "flex-end" as const,
    marginTop: 8,
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "500" as const,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "500" as const,
  },
  commentActions: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  },
  actionButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  likeButton: {
    // Special styling for like button
  },
  actionText: {
    fontSize: 13,
    color: "#666",
  },
  likedText: {
    color: "#ff6b6b",
  },
  ownerActions: {
    flexDirection: "row" as const,
  },
  separator: {
    height: 1,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
  },
  loadMoreButton: {
    paddingVertical: 16,
    alignItems: "center" as const,
  },
  loadMoreText: {
    color: "#007AFF",
    fontWeight: "500" as const,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  inputWrapper: {
    flexDirection: "row" as const,
    alignItems: "flex-end" as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 100,
    backgroundColor: "#f8f8f8",
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center" as const,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "500" as const,
  },
});
CommentItem.displayName = "CommentItem";
