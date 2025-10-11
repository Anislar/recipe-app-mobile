import React, { useState, useCallback } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Separator, ScreenWrapper, ListFooterComponent } from "@/components";
import { useNotificationMutations } from "@/hooks/notification/useNotificationMutation";
import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import { EmptyState } from "@/components/notification/empty";
import { ErrorState } from "@/components/UI/error";
import { Header } from "@/components/notification/header";
import { DefaultFallback } from "@/components/with-suspense";
import { NotificationCard } from "@/components/notification/item";

const NotificationsScreen = () => {
  const { t } = useTranslation();
  const [showOnlyUnread, setShowOnlyUnread] = useState(true);

  const {
    notifications,
    size,
    isLoading,
    isError,
    error,
    isRefetching,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    loadMore,
    markedRead,
    deleteNotification,
    refetch,
    isDeleting,
  } = useNotificationMutations(showOnlyUnread ? "unread" : "all");

  const handleRefresh = useCallback(() => refetch(), [refetch]);
  const handleEndReached = useCallback(
    () => hasNextPage && !isFetchingNextPage && loadMore(),
    [hasNextPage, isFetchingNextPage, loadMore]
  );

  return (
    <ScreenWrapper bg="white">
      <View style={styles.header}>
        {/* Header */}
        <Header
          count={size}
          showOnlyUnread={showOnlyUnread}
          setShowOnlyUnread={setShowOnlyUnread}
        />
      </View>
      <Separator bg={THEME.colors.gray} my={hp(1)} />

      {/* Notifications List */}
      {isLoading ? (
        <View style={styles.center}>
          <DefaultFallback isReady />
        </View>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : (
        <FlatList
          data={notifications}
          renderItem={({ item, index }) => (
            <NotificationCard
              notification={item}
              index={index}
              markAsRead={markedRead}
              deleteNotification={deleteNotification}
              isDeleting={isDeleting}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onRefresh={handleRefresh}
          refreshing={isRefetching && !isFetching}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={<EmptyState showOnlyUnread={showOnlyUnread} />}
          ListFooterComponent={
            <ListFooterComponent
              text={t("notification.noMore")}
              size={size}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          }
          removeClippedSubviews
          maxToRenderPerBatch={5}
          windowSize={5}
          initialNumToRender={10}
          updateCellsBatchingPeriod={100}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: wp(2.5), paddingVertical: wp(2.5) },
  listContent: { padding: 16, gap: 8 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default NotificationsScreen;
