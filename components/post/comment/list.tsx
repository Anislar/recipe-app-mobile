import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

import { ListFooterComponent, LoadingSpinner, Separator } from "@/components";
import { useComment } from "@/hooks/comment/useComment";
import { useCommentActions } from "@/hooks/comment/useCommentActions";
import { useAuthStore } from "@/store";
import { Comment } from "@/type/coment.type";
import { EmptyCommentsState } from "./empty";
import { ErrorState } from "./error";
import { CommentsHeader } from "./header";
import { CommentInput } from "./input";
import { CommentItem } from "./item";

// Import components
interface CommentsSectionProps {
  postId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id);
  const {
    comments,
    size,
    isLoading,
    isError,
    error,
    isRefetching,
    isFetching,
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
    deleteError,
  } = useComment({ postId, enabled: true });

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      loadMore();
    }
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  const {
    editingId,
    editContent,
    setEditContent,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
    handleLike,
    isCurrentUser,
  } = useCommentActions({
    comments,
    updateComment,
    toggleLike,
    userId,
  });

  // Handle refresh
  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Handle add comment
  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;
    await addComment(newComment.trim());
    setNewComment("");
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [newComment, addComment]);

  // Render comment item
  const renderComment = useCallback(
    ({ item: comment }: { item: Comment }) => (
      <CommentItem
        comment={comment as any}
        onLike={handleLike}
        onEdit={handleEditStart}
        editContent={editContent}
        isEditing={editingId === comment?.id}
        isUpdating={isUpdating}
        onEditContentChange={setEditContent}
        onCancelEdit={handleEditCancel}
        onSaveEdit={handleEditSave}
        isCurrentUser={isCurrentUser(comment)}
        isDeleting={isDeleting}
        deleteError={deleteError}
        onDelete={deleteComment}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      editingId,
      isUpdating,
      editContent,
      handleEditStart,
      deleteComment,
      handleLike,
      handleEditCancel,
      handleEditSave,
      isCurrentUser,
      isDeleting,
      deleteError,
    ]
  );

  // Error state
  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <>
      {/* Header */}
      <CommentsHeader commentsCount={size || 0} />

      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={styles.loading}>
            <LoadingSpinner size="large" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={comments}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderComment}
            ListFooterComponent={
              <ListFooterComponent
                text={t("post.Footer.noMore")}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                size={size}
              />
            }
            ListEmptyComponent={<EmptyCommentsState />}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching && !isFetching}
                onRefresh={onRefresh}
              />
            }
            contentContainerStyle={[
              styles.listContent,
              comments?.length === 0 && styles.listContentEmpty,
            ]}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ItemSeparatorComponent={() => <Separator my={0} bg="#f5f5f5" />}
            showsVerticalScrollIndicator={true}
            bounces={true}
            //scrollEnabled={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={5}
          />
        )}
      </View>

      <CommentInput
        value={newComment}
        onChangeText={setNewComment}
        onSubmit={handleAddComment}
        isLoading={isAdding}
      />
    </>
  );
};
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  listContentEmpty: {
    justifyContent: "center",
    minHeight: 150,
  },
});
