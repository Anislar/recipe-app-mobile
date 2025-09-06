import { useComment } from "@/hooks/comment/useComment";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CommentItem } from "./item";
import { Comment } from "@/type/coment.type";
import FormWrapper from "@/components/form-wrapper";

interface CommentsSectionProps {
  postId: string;
}

// Main Comments Section Component
export const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const {
    comments,
    isLoading,
    isError,
    error,
    isRefetching,
    hasNextPage,
    isFetchingNextPage,
    loadMore,
    addComment,
    updateComment,
    deleteComment,
    toggleLike,
    refetch,
    isAdding,
    isUpdating,
    isDeleting,
  } = useComment({ postId, enabled: false });

  // Handle refresh
  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Handle add comment
  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;

    await addComment(newComment.trim());
    setNewComment("");
    // Scroll to top to show new comment
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [newComment, addComment]);

  // Handle edit
  const handleEditStart = useCallback((commentId: string) => {
    //const comment = comments.find((c) => c.id === commentId);
    //if (comment) {
    setEditingId(commentId);
    setEditContent("abcdef");
    // }
  }, []);

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

  // Handle delete
  const handleDelete = useCallback(
    async (commentId: string) => {
      await deleteComment(commentId);
    },
    [deleteComment]
  );

  // Handle like toggle
  const handleLike = useCallback(
    async (commentId: string, isLiked: boolean) => {
      await toggleLike(commentId, isLiked);
    },
    [toggleLike]
  );

  // Check if user can edit/delete comment
  const isCurrentUser = useCallback((comment: Comment) => {
    // Replace with your auth logic
    return comment?.authorId === "current-user";
  }, []);

  // Render comment item
  const renderComment = useCallback(
    ({ item: comment }: { item: Comment }) => (
      <CommentItem
        comment={comment as any}
        onEdit={handleEditStart}
        onDelete={handleDelete}
        onLike={handleLike}
        isEditing={editingId === comment.id}
        onCancelEdit={handleEditCancel}
        onSaveEdit={handleEditSave}
        editContent={editContent}
        onEditContentChange={setEditContent}
        isCurrentUser={isCurrentUser(comment)}
      />
    ),
    [
      editingId,
      editContent,
      handleEditStart,
      handleDelete,
      handleLike,
      handleEditCancel,
      handleEditSave,
      isCurrentUser,
    ]
  );

  // Render load more footer
  const renderFooter = useCallback(() => {
    if (!hasNextPage) return null;

    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={loadMore}
        disabled={isFetchingNextPage}
      >
        {isFetchingNextPage ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Text style={styles.loadMoreText}>Load More Comments</Text>
        )}
      </TouchableOpacity>
    );
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  // Error state
  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load comments: {error?.message}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FormWrapper
      style={[styles.container, { maxHeight: isExpanded ? undefined : 500 }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comments (10)</Text>
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Ionicons
            name={isExpanded ? "chevron-down" : "chevron-up"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Comments List */}
      {/* {isLoading && comments.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading comments...</Text>
        </View>
      ) : (
        <FlatList
          scrollEnabled={false}
          ref={flatListRef}
          data={generateFakeComments("1", 12)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComment}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          getItemLayout={(data, index) => ({
            length: 100, // Approximate height
            offset: 100 * index,
            index,
          })}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )} */}

      {/* Add Comment Input */}
      {/* <BlurView intensity={20} style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input]}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Write a comment..."
            multiline
            maxLength={500}
            editable={!isAdding}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!newComment.trim() || isAdding) && styles.sendButtonDisabled,
            ]}
            onPress={handleAddComment}
            disabled={!newComment.trim() || isAdding}
          >
            {isAdding ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </BlurView> */}
    </FormWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
