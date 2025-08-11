import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { hp, wp } from "@/helpers/common";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { THEME } from "@/constants/theme";
import { useSelectedColors } from "@/store";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";

interface CategorySelectorProps {
  control: any;
  onOpen: () => void;
}
const CategorySelector = ({ control, onOpen }: CategorySelectorProps) => {
  const selected = useSelectedColors();
  const { t } = useTranslation();

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.label}>{t("post.category.label")}:</Text>
      <Controller
        control={control}
        name="category"
        render={({ field: { value }, fieldState: { error } }) => (
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => onOpen()}
            activeOpacity={0.7}
          >
            <View style={styles.button}>
              <MaterialCommunityIcons
                name={(value?.icon as any) ?? "tag"}
                size={28}
                color={selected.primary}
              />
              <Text
                style={[styles.label, value?.label && styles.selectedLabel]}
              >
                {value?.label ?? t("post.category.placeholder")}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={28}
              color={THEME.colors.darkGray}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    gap: hp(1),
    flex: 1,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  selectorButton: {
    flexDirection: "row",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(2),
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.gray,
  },
  label: {
    fontSize: hp(1.6),
    color: THEME.colors.text,
    fontWeight: THEME.fonts.medium,
  },
  selectedLabel: {
    color: THEME.colors.text,
    fontWeight: "600",
  },
  errorText: {
    color: THEME.colors.rose,
    fontSize: hp(1.5),
    marginLeft: 5,
  },
});
export default CategorySelector;
