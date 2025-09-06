import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { lazy, Suspense, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  BottomSheetComponent,
  Button,
  LoadingSpinner,
  NoPosts,
  PostCard,
  ScreenWrapper,
  Separator,
  TextInputComponent,
} from "@/components";
import { DefaultFallback } from "@/components/with-suspense";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { Post } from "@/helpers/post";
import { useSearch } from "@/hooks/search/useSearch";
import Animated, { FadeInRight, FadeOutRight } from "react-native-reanimated";

const FilterComponent = lazy(() =>
  import("@/components").then((el) => ({
    default: el.FilterComponent,
  }))
);
const SearchScreen: React.FC = () => {
  const { t } = useTranslation();
  // Bottom sheet ref
  const bottomSheetRef = useRef<any>(null);
  const openFilters = useCallback((): void => {
    bottomSheetRef.current?.expand();
  }, []);

  const renderPost: ListRenderItem<any> = useCallback(
    ({ item, index }) => (
      <PostCard
        enableNavigation
        showAction={false}
        post={
          {
            ...item,
            user: {
              id: item.userId,
              avatar: item.avatar,
              name: item.name,
            },
          } as any
        }
        index={index}
      />
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: Post): string => item.id.toString(),
    []
  );

  const renderHeader = (): React.ReactElement | null =>
    !searchResult?.pagination?.totalItems && filterCount === 0 ? null : (
      <>
        <Text style={styles.sectionTitle}>
          {t("search.filter.header", {
            count: searchResult?.pagination?.totalItems!,
          })}
        </Text>
      </>
    );

  const renderEmpty = (): React.ReactElement => (
    <>
      <NoPosts subtitle={t("search.filter.noResultSubTitle")} />
    </>
  );

  // handle actions
  const {
    onChangeSearch,
    setFilter,
    clearAllFilters,
    refetch,
    searchText,
    status,
    filterCount,
    searchResult,
    activeFilters,
  } = useSearch();
  const ListFooterComponent = useCallback(
    () =>
      searchResult?.pagination?.totalItems! > 0 && (
        <View style={styles.loadingMore}>
          {searchResult?.pagination.hasNext || status.state === "loading" ? (
            <LoadingSpinner size="large" />
          ) : (
            !searchResult?.pagination.hasNext && (
              <View>
                <Separator />
                <Text style={styles.noMorePost}>
                  {" "}
                  {t("post.empty.noMore")}{" "}
                </Text>
              </View>
            )
          )}
        </View>
      ),
    [
      searchResult?.pagination.hasNext,
      searchResult?.pagination?.totalItems,
      status,
      t,
    ]
  );
  const ShowFilter = useCallback(
    () =>
      searchResult?.pagination?.totalItems! > 0 && (
        <Animated.View entering={FadeInRight.delay(100)} exiting={FadeOutRight}>
          <TouchableOpacity
            style={styles.filterCountContainer}
            onPress={openFilters}
          >
            <MaterialCommunityIcons
              name="filter"
              color={THEME.colors.grey2}
              size={24}
            />
            {filterCount > 0 && (
              <View style={styles.filterCount}>
                <Text style={styles.filterCountText}>{filterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterCount, searchResult?.pagination?.totalItems]
  );
  return (
    <ScreenWrapper bg="white" pt={5}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInputComponent
            scrollEnabled={false}
            containerStyles={[
              styles.searchInput,
              {
                width:
                  searchResult?.pagination?.totalItems! > 0 ? wp(80) : "100%",
              },
            ]}
            keyboardType="default"
            enterKeyHint="search"
            placeholder={t("search.filter.placeholder")}
            value={searchText}
            onChangeText={onChangeSearch}
            placeholderTextColor={THEME.colors.grey2}
            suffixIcon={searchText.length ? "close-circle" : undefined}
            onPressIcon={() => {
              clearAllFilters();
              onChangeSearch("");
            }}
          />
          {ShowFilter()}
        </View>
        <Text style={styles.searchInputSubtitle}>
          {t("search.filter.subtitleInput")}
        </Text>
      </View>

      {/* Posts List */}
      {status.state === "loading" ? (
        <View style={styles.center}>
          <DefaultFallback isReady />
        </View>
      ) : status.state === "error" ? (
        <View style={[styles.center, { flexDirection: "column" }]}>
          <Text style={styles.errorText}>
            {"🚨 " + t("common.error") + ": - " + status.message ||
              "Server not reachable!"}
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
          data={searchResult?.posts}
          renderItem={renderPost}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <Separator />}
          ListFooterComponent={ListFooterComponent}
          onEndReached={() => {}}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={5}
          initialNumToRender={10}
          updateCellsBatchingPeriod={100}
        />
      )}

      {/* Bottom Sheet for Filters */}
      <BottomSheetComponent ref={bottomSheetRef} snapPoints={["60%", "70%"]}>
        <Suspense fallback={<LoadingSpinner />}>
          <FilterComponent
            hashtagFilters={searchResult?.hashtags ?? []}
            count={searchResult?.pagination.totalItems!}
            setFilter={setFilter}
            clearAllFilters={clearAllFilters}
            activeFilters={activeFilters}
          />
        </Suspense>
      </BottomSheetComponent>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
  },

  searchInput: {
    height: hp(6),
    paddingVertical: hp(0.5),
    paddingLeft: wp(5),
    paddingRight: wp(2),
    borderWidth: 1,
    borderColor: THEME.colors.gray,
    borderRadius: THEME.radius.sm,
    fontSize: hp(1.8),
    backgroundColor: THEME.colors.grayLight,
  },
  searchInputSubtitle: {
    fontSize: hp(1.6),
    paddingLeft: 5,
    marginVertical: 5,
    color: THEME.colors.grey2,
  },
  filterCountContainer: {
    width: wp(11),
    height: wp(11),
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    padding: wp(2),
    borderWidth: 1,
    borderColor: THEME.colors.gray,
    borderRadius: THEME.radius.sm,
  },
  filterCount: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: THEME.colors.rose,
    paddingHorizontal: wp(1),
    borderRadius: THEME.radius.sm,
    width: wp(5),
    height: wp(5),
    alignItems: "center",
    justifyContent: "center",
  },
  filterCountText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: THEME.fonts.bold,
  },
  listContainer: {
    paddingBottom: wp(20),
  },
  trendingSection: {
    padding: wp(2),
  },
  sectionTitle: {
    fontSize: hp(2),
    color: THEME.colors.grey2,
    padding: hp(2),
  },
  hashtagList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  hashtagContainer: {
    paddingVertical: wp(1.5),
    paddingHorizontal: 12,
    borderRadius: THEME.radius.xl,
  },
  hashtagText: {
    color: "white",
    fontSize: 13,
    fontWeight: THEME.fonts.medium,
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  errorText: {
    color: THEME.colors.rose,
    fontSize: hp(1.8),
    fontWeight: THEME.fonts.medium,
  },
  refreshButton: {
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.5),
    gap: 5,
    marginTop: 5,
    backgroundColor: THEME.colors.rose,
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
  loadingMore: {
    marginBottom: hp(4),
  },
});

export default SearchScreen;
