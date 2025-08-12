import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getCategoryColor } from "../utils";

export const CategoryTag: React.FC<{ category?: string }> = ({ category }) => {
  if (!category) return null;
  const color = getCategoryColor(category);
  return (
    <View style={[styles.tag, { backgroundColor: `${color}15` }]}>
      <Text style={[styles.text, { color }]}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});

export default CategoryTag;
