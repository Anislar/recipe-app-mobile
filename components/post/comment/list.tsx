import { memo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import { ListFooterComponent, LoadingSpinner, Separator } from "@/components";
import { useComment } from "@/hooks/comment/useComment";
import { useCommentActions } from "@/hooks/comment/useCommentActions";
import { Comment } from "@/type/coment.type";
import { EmptyCommentsState } from "./empty";
import { ErrorState } from "./error";
import { CommentsHeader } from "./header";
import { CommentInput } from "./input";
import { CommentItem } from "./item";

interface CommentsSectionProps {
  postId: string;
  expanded: boolean;
  toggleExpand: () => void;
}

export const CommentSection: React.FC<CommentsSectionProps> = memo(
  ({ postId, expanded, toggleExpand }) => {
    const flatListRef = useRef<FlatList>(null);

    const { t } = useTranslation();

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

    // Handle add comment with smooth scroll
    const handleAddComment = useCallback(
      async (text: string, parent_id?: string): Promise<boolean> => {
        try {
          await addComment(text.trim(), parent_id);

          // Smooth scroll to top after adding comment
          setTimeout(() => {
            flatListRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            });
          }, 100);
          return true;
        } catch (error) {
          console.error("Error adding comment:", error);
          return false;
        }
      },
      [addComment]
    );
    const {
      // action
      activeAction,
      actionContent,
      handleActionSave,
      handleActionCancel,
      updateActionContent,
      handleActionStart,
      // other
      handleLike,
      isCurrentUser,
    } = useCommentActions({
      updateComment,
      toggleLike,
      addReply: handleAddComment,
      postId,
    });

    // Handle refresh
    const onRefresh = useCallback(async () => {
      await refetch();
    }, [refetch]);

    // Render comment item with optimizations
    const renderComment = useCallback(
      ({ item: comment }: { item: Comment }) => (
        <CommentItem
          comment={comment as any}
          onLike={handleLike}
          actionContent={actionContent}
          activeAction={activeAction}
          onEdit={handleActionStart}
          isUpdating={isUpdating}
          isAdding={isAdding}
          updateActionContent={updateActionContent}
          handleActionCancel={handleActionCancel}
          handleActionSave={handleActionSave}
          isCurrentUser={isCurrentUser(comment)}
          isDeleting={isDeleting}
          deleteError={deleteError}
          onDelete={deleteComment}
        />
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        actionContent,
        activeAction,
        isUpdating,
        isCurrentUser,
        isDeleting,
        deleteError,
      ]
    );

    // Error state
    if (isError) {
      return <ErrorState error={error} onRetry={() => refetch()} />;
    }
    //
    return (
      <>
        {/* Header */}
        <CommentsHeader
          expanded={expanded}
          toggleExpand={toggleExpand}
          commentsCount={size || 0}
        />
        <CommentInput
          toggleExpand={toggleExpand}
          onSubmit={(content: string) => handleAddComment(content)}
          isLoading={isAdding}
        />
        {/* Comments List */}
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
            onEndReachedThreshold={0.3}
            ItemSeparatorComponent={() => <Separator my={0} bg="#f5f5f5" />}
            showsVerticalScrollIndicator={true}
            bounces={true}
            removeClippedSubviews={Platform.OS === "android"}
            maxToRenderPerBatch={8}
            windowSize={5}
            initialNumToRender={6}
            updateCellsBatchingPeriod={50}
            keyboardShouldPersistTaps="handled"
            //scrollEnabled={false}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10,
            }}
          />
        )}
      </>
    );
  }
);

CommentSection.displayName = "CommentSection";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loading: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  listContentEmpty: {
    justifyContent: "center",
    minHeight: 200,
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e1e5e9",
    paddingHorizontal: 16,
    paddingTop: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
