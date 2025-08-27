import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";

import {
  CategoryItem,
  LoadingSpinner,
  PostCard,
  ScreenWrapper,
  Separator,
  NoPosts,
} from "@/components";
import { hp, wp } from "@/helpers/common";
import { categories } from "@/helpers/post/utils";
import { useTranslation } from "react-i18next";
import { THEME } from "@/constants/theme";
import { postService } from "@/services/api/post.service";
import { DefaultFallback } from "@/components/with-suspense";
import { useMemo, useState } from "react";
import { CategoryIDs } from "@/type";

const HomePage = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<CategoryIDs>("general");
  const {
    isError,
    isRefetching,
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
    <ScreenWrapper bg="white">
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoryLabel}>{t("post.category.label")} </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat) => (
            <CategoryItem
              key={cat.id}
              category={cat}
              isSelected={category === cat.id}
              onPress={() => setCategory(cat?.id)}
            />
          ))}
        </ScrollView>
      </View>

      <Separator />
      {/* Posts */}

      {isLoading ? (
        <View style={styles.center}>
          <DefaultFallback isReady />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {"🚨 " + t("common.error") + ":" + error?.message}
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            ListEmptyComponent={
              <NoPosts
                showRefreshButton={isError}
                onRefresh={() => refetch()}
              />
            }
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            data={posts}
            renderItem={({ item }) => <PostCard post={item as any} />}
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
        </>
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
});
export default HomePage;
