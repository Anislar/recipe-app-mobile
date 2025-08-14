import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { CategoryType } from "@/type";
import { THEME } from "@/constants/theme";

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
      isSelected && { backgroundColor: category.color + "20" },
    ]}
    onPress={onPress}
  >
    <Ionicons
      name={category.icon}
      size={20}
      color={isSelected ? category.color : THEME.colors.grey2}
    />
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  categoryItemText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
    color: THEME.colors.grey2,
  },
});
