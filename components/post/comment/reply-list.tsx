import { memo, useCallback } from "react";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import { wp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import { ReplyItem } from "./reply-item";
import { ListFooterComponent } from "@/components/UI/footer";
import { useTranslation } from "react-i18next";
import { useCommentReplies } from "@/hooks/comment/useCommentReplies";
import { EmptyCommentsState } from "./empty";
import { RefreshControl } from "react-native-gesture-handler";
import { Separator } from "@/components/UI/separator";
import { useCommentMutation } from "@/hooks/comment/useCommentMutation";
import { Comment } from "@/type";

interface RepliesListProps {
  parentId: string;
}

export const RepliesList: React.FC<RepliesListProps> = memo(({ parentId }) => {
  const { t } = useTranslation();

  const {
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isRefetching,
    refetch,
    loadMore,
    replies,
  } = useCommentReplies(parentId, true);

  const { toggleLike } = useCommentMutation({
    postId: "", // Not needed here
  });

  const handleLike = useCallback(
    async (commentId: string) => {
      await toggleLike(commentId);
    },
    [toggleLike]
  );

  const renderReply = useCallback(
    ({ item }: { item: Comment }) => (
      <ReplyItem onLike={handleLike} comment={item as any} />
    ),
    [handleLike]
  );

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      loadMore();
    }
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  return (
    <View style={styles.container}>
      <FlatList
        data={replies}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderReply}
        ListFooterComponent={
          <ListFooterComponent
            text={t("post.Footer.noMore")}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            size={replies.length}
          />
        }
        ListEmptyComponent={<EmptyCommentsState />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetching}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={styles.listContent}
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
    </View>
  );
});

RepliesList.displayName = "RepliesList";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: THEME.colors.gray,
    marginLeft: wp(4),
  },
  listContent: {
    paddingVertical: 4,
  },
});
