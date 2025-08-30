import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, memo } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { CategoryType } from "@/type";

interface CategoryItemProps {
  category: CategoryType;
  isSelected: boolean;
  onPress: () => void;
}

export const CategoryItem = memo(
  ({ category, isSelected, onPress }: CategoryItemProps) => {
    const handlePress = useCallback(() => {
      onPress();
    }, [onPress]);

    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isSelected && {
            backgroundColor: category.color + "20",
            borderColor: category.color,
          },
        ]}
        onPress={handlePress}
      >
        <Ionicons name={category.icon} size={20} color={category.color} />
        <Text
          style={[
            styles.categoryItemText,
            isSelected && { color: category.color },
          ]}
        >
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  }
);

CategoryItem.displayName = "CategoryItem";

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
