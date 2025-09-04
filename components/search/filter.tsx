import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { categories } from "@/helpers/post/utils";
import { ActiveFilters } from "@/type";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import { Button } from "../UI/button";
import { Separator } from "../UI/separator";
import TextInputComponent from "../UI/text-input";
import FormWrapper from "../form-wrapper";
import { FilterChip } from "./filter-chip";

const listOfCategories: string[] = categories.map((elem) => elem.id);
const dateRange: string[] = ["all", "day", "week", "month"];
interface FilterComponentProps {
  setFilter: (filterType: keyof ActiveFilters, value: string) => void;
  activeFilters: ActiveFilters;
  clearAllFilters: () => void;
  hashtagFilters: string[];
  count: number;
}

export const FilterComponent: FC<FilterComponentProps> = ({
  setFilter,
  clearAllFilters,
  activeFilters,
  hashtagFilters,
  count,
}) => {
  const { t } = useTranslation();
  return (
    <FormWrapper mb={5}>
      <Text style={styles.filterTitle}>
        {" "}
        {t("search.filter.title")}{" "}
        {" (" +
          t("search.filter.header2", {
            count,
          })}
        {") "}
      </Text>
      <Text style={styles.filterSubTitle}> {t("search.filter.subTitle")}</Text>

      <Separator my={hp(2.5)} />
      {/* Category Filter */}
      <View style={styles.filterGroup}>
        <View style={styles.filterLabelContainer}>
          <MaterialCommunityIcons
            name="tag-outline"
            size={20}
            color={THEME.colors.text}
          />
          <Text style={styles.filterLabel}>{t("post.category.label")} </Text>
        </View>

        <View style={styles.filterOptions}>
          {listOfCategories.map((cat: string) => (
            <FilterChip
              key={cat}
              label={cat.charAt(0).toUpperCase() + cat.slice(1)}
              filterType="category"
              value={cat}
              isActive={activeFilters.category === cat}
              onPress={setFilter}
            />
          ))}
        </View>
      </View>

      {/* Date  Filter */}
      <View style={styles.filterGroup}>
        <View style={styles.filterLabelContainer}>
          <MaterialCommunityIcons
            name="calendar"
            size={20}
            color={THEME.colors.text}
          />
          <Text style={styles.filterLabel}>{t("search.filter.dateRange")}</Text>
        </View>

        <View style={styles.filterOptions}>
          {dateRange.map((type: string) => (
            <FilterChip
              key={type}
              label={type}
              filterType="dateRange"
              value={type}
              isActive={activeFilters.dateRange === type}
              onPress={setFilter}
            />
          ))}
        </View>
      </View>

      {/* Location Filter */}
      <View style={styles.filterGroup}>
        <View style={styles.filterLabelContainer}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={20}
            color={THEME.colors.text}
          />
          <Text style={styles.filterLabel}>{t("post.location.label")} </Text>
        </View>
        <TextInputComponent
          containerStyles={styles.locationInput}
          placeholder="Enter city or country..."
          value={activeFilters.location as string}
          onChangeText={(text) => setFilter("location", text)}
          placeholderTextColor={THEME.colors.grey2}
        />
      </View>

      {/* Hashtag Filter */}
      {hashtagFilters.length > 0 && (
        <View style={styles.filterGroup}>
          <View style={styles.filterLabelContainer}>
            <Feather name="hash" size={20} color={THEME.colors.text} />
            <Text style={styles.filterLabel}>
              {t("search.filter.hashtag")}{" "}
            </Text>
          </View>
          <View style={styles.filterOptions}>
            {hashtagFilters.map((hashtag: string) => (
              <FilterChip
                key={hashtag}
                label={`#${hashtag}`}
                filterType="hashtag"
                value={hashtag}
                isActive={activeFilters.hashtag === hashtag}
                onPress={setFilter}
              />
            ))}
          </View>
        </View>
      )}
      <Button
        icon="trash-can"
        buttonStyle={styles.buttonClearFilter}
        title={t("search.filter.clearFilter")}
        onPress={clearAllFilters}
      />
    </FormWrapper>
  );
};

const styles = StyleSheet.create({
  filterTitle: {
    fontSize: hp(2.5),
    fontWeight: THEME.fonts.semibold,
    color: THEME.colors.text,
  },
  filterSubTitle: {
    fontSize: hp(1.6),
    fontWeight: THEME.fonts.normal,
    color: THEME.colors.gray,
  },

  filterGroup: {
    marginBottom: hp(2),
  },
  filterLabelContainer: {
    flexDirection: "row",
    gap: 5,
  },
  filterLabel: {
    fontSize: hp(1.8),
    fontWeight: THEME.fonts.medium,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  locationInput: {
    fontSize: hp(1.8),
    height: hp(6),
    paddingVertical: hp(0.5),
    paddingLeft: wp(5),
    paddingRight: wp(2),
  },
  buttonClearFilter: {
    height: hp(6),
    marginTop: hp(1.8),
  },
});
