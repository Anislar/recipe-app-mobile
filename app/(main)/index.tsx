import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

import Animated, { FadeInRight } from "react-native-reanimated";

import {
  Button,
  CategoryItem,
  LoadingSpinner,
  NoPosts,
  PostCard,
  ScreenWrapper,
  Separator,
} from "@/components";
import { DefaultFallback } from "@/components/with-suspense";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { categories } from "@/helpers/post/utils";
import { postService } from "@/services/api/post.service";
import { CategoryIDs } from "@/type";

const HomePage = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<CategoryIDs>("general");
  const {
    isError,
    isRefetching,
    isFetching,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts", category],
    queryFn: ({ pageParam = 1, signal }) =>
      postService.fetchPost({
        page: pageParam,
        signal,
        filters: { category },
        // filters: meta,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (
        lastPage?.data?.pagination?.page &&
        lastPage?.data?.pagination?.totalPages &&
        lastPage.data.pagination.page < lastPage.data.pagination.totalPages
      ) {
        return lastPage.data.pagination.page + 1;
      }
      return undefined;
    },
  });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => (page as any).data?.results) ?? [],
    [data?.pages]
  );

  return (
    <ScreenWrapper pt={1} bg="white">
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoryLabel}>{t("post.category.label")} </Text>
        <FlatList
          horizontal
          contentContainerStyle={{
            gap: 5,
            paddingVertical: wp(2),
          }}
          data={categories}
          renderItem={({ item, index }) => (
            <Animated.View
              key={item.id}
              entering={FadeInRight.delay(index * 100).duration(400)}
            >
              <CategoryItem
                category={item}
                isSelected={category === item.id}
                onPress={() => setCategory(item?.id)}
              />
            </Animated.View>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Separator />
      {/* Posts */}

      {isLoading ? (
        <View style={styles.center}>
          <DefaultFallback isReady />
        </View>
      ) : error ? (
        <View style={[styles.center, { flexDirection: "column" }]}>
          <Text style={styles.errorText}>
            {"🚨 " +
              t("common.error") +
              ": - " +
              (error?.message ?? "Server not reachable!")}
          </Text>
          <Button
            title={t("common.refresh", "Refresh")}
            onPress={() => refetch()}
            icon="refresh"
            buttonStyle={styles.refreshButton}
          />
        </View>
      ) : (
        <FlatList
          ListEmptyComponent={
            <NoPosts showRefreshButton={isError} onRefresh={() => refetch()} />
          }
          refreshing={isRefetching && !isFetching}
          onRefresh={() => refetch()}
          data={posts}
          renderItem={({ item, index }) => (
            <PostCard post={item as any} index={index} />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isFetchingNextPage ? (
              <LoadingSpinner size="small" />
            ) : (
              posts.length > 0 && (
                <View>
                  <Separator />
                  <Text style={styles.noMorePost}> No more Post </Text>
                </View>
              )
            )
          }
        />
      )}
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  categoriesContainer: {
    paddingHorizontal: wp(5),
  },
  categoryLabel: {
    fontSize: hp(2),
    color: THEME.colors.darkGray,
    fontWeight: THEME.fonts.medium,
  },
  categoriesContent: {
    gap: wp(5),
    paddingVertical: hp(1),
  },
  center: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  noMorePost: {
    fontSize: hp(2.5),
    marginBottom: hp(2.5),
    color: THEME.colors.gray,
    textAlign: "center",
    fontWeight: THEME.fonts.medium,
  },
  errorText: {
    color: THEME.colors.rose,
    fontSize: hp(2.3),
    fontWeight: THEME.fonts.medium,
  },
  refreshButton: {
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.5),
    gap: 5,
    marginTop: 5,
    backgroundColor: THEME.colors.rose,
  },
});
export default HomePage;
