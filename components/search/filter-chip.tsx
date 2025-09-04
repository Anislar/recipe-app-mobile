import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FilterChipProps } from "@/type";
import { useSelectedColors } from "@/store";

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  filterType,
  value,
  isActive,
  onPress,
}) => {
  const selected = useSelectedColors();

  return (
    <TouchableOpacity
      style={[
        styles.filterChip,
        isActive && {
          backgroundColor: selected.primaryDark,
          borderColor: selected.primaryDark,
        },
      ]}
      onPress={() => onPress(filterType, value)}
    >
      <Text
        style={[styles.filterChipText, isActive && styles.filterChipTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  filterChip: {
    backgroundColor: "#f7f9fb",
    borderWidth: 1,
    borderColor: "#e1e8ed",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  filterChipActive: {
    backgroundColor: "#1da1f2",
    borderColor: "#1da1f2",
  },
  filterChipText: {
    fontSize: 13,
    color: "#1a1a1a",
  },
  filterChipTextActive: {
    color: "white",
  },
});
