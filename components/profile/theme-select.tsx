import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useThemeStore } from "@/store";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { colorPicker, ThemeKey } from "@/store/theme.store";

export const ThemeSelect = () => {
  const selected = useThemeStore((s) => s.selected);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Theme Color</Text>
      <View style={styles.grid}>
        {Object.entries(colorPicker).map(([key, value]) => {
          const isActive = selected === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setTheme(key as ThemeKey)}
              style={[
                styles.colorCircle,
                { backgroundColor: value.primary },
                isActive && styles.activeBorder,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: hp(2),
    fontWeight: THEME.fonts.bold,
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(10),
  },
  colorCircle: {
    width: hp(5.2),
    height: hp(5.2),
    borderRadius: THEME.radius.xxl * 1.2,
    borderWidth: 2,
    borderColor: THEME.colors.gray,
  },
  activeBorder: {
    borderColor: "#000",
    borderWidth: 2,
  },
});
