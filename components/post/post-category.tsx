import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { CategoryType } from "@/type";

interface CategoryItemProps {
  category: CategoryType;
  isSelected: boolean;
  onPress: () => void;
}

export const CategoryItem = ({
  category,
  isSelected,
  onPress,
}: CategoryItemProps) => (
  <TouchableOpacity
    style={[
      styles.categoryItem,
      isSelected && {
        backgroundColor: category.color + "20",
        borderColor: category.color,
      },
    ]}
    onPress={onPress}
  >
    <Ionicons name={category.icon} size={20} color={category.color} />
    <Text
      style={[styles.categoryItemText, isSelected && { color: category.color }]}
    >
      {category.name}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(1.2),
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    gap: 5,
    borderColor: THEME.colors.grey2 + "60",
  },
  categoryItemText: {
    fontSize: hp(1.4),
    fontWeight: THEME.fonts.medium,
    padding: 0,
    color: THEME.colors.grey2,
  },
});
