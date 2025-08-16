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
import { usePostStore } from "@/store/post.store";

const HomePage = () => {
  const { t } = useTranslation();
  const { setCategory, category } = usePostStore();

  const {
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
  const posts =
    data?.pages.flatMap((page) => (page as any).data?.results) ?? [];
  console.log("🚀 ~ HomePage ~ posts:", posts);

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
              <NoPosts showRefreshButton onRefresh={() => refetch()} />
            }
            data={
              posts
              //   [
              //   {
              //     id: 1,
              //     user: {
              //       name: "Sarah Chen",
              //       username: "@sarahc",
              //       avatar: "https://randomuser.me/api/portraits/women/1.jpg",
              //     },
              //     content:
              //       "Just finished an amazing hiking trail! The view was absolutely breathtaking 🌄",
              //     image: "https://picsum.photos/400/300?random=1",
              //     category: "travel",
              //     likes: 124,
              //     comments: 18,
              //     time: "2h",
              //     liked: false,
              //   },
              //   {
              //     id: 2,
              //     user: {
              //       name: "Alex Rodriguez",
              //       username: "@alexr",
              //       avatar: "https://randomuser.me/api/portraits/men/1.jpg",
              //     },
              //     content: "Coffee and code - perfect Sunday morning combo ☕️💻",
              //     category: "tech",
              //     likes: 89,
              //     comments: 12,
              //     time: "4h",
              //     liked: true,
              //   },
              //   {
              //     id: 3,
              //     user: {
              //       name: "Maya Patel",
              //       username: "@mayap",
              //       avatar: "https://randomuser.me/api/portraits/women/2.jpg",
              //     },
              //     content:
              //       "New art piece finished! Mixed media on canvas. What do you think?",
              //     image: "https://picsum.photos/400/300?random=2",
              //     category: "art",
              //     likes: 156,
              //     comments: 24,
              //     time: "6h",
              //     liked: false,
              //   },
              //   {
              //     id: 4,
              //     user: {
              //       name: "John Smith",
              //       username: "@johns",
              //       avatar: "https://randomuser.me/api/portraits/men/2.jpg",
              //     },
              //     content: "Amazing pasta at this new Italian restaurant! 🍝✨",
              //     image: "https://picsum.photos/400/300?random=3",
              //     category: "food",
              //     likes: 78,
              //     comments: 9,
              //     time: "8h",
              //     liked: false,
              //   },
              // ]
            }
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
