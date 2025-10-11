import React, { FC } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  showOnlyUnread: boolean;
  setShowOnlyUnread: (value: boolean) => void;
  count: number;
}

export const Header: FC<HeaderProps> = ({
  showOnlyUnread,
  setShowOnlyUnread,
  count,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShowOnlyUnread(!showOnlyUnread)}
        style={[styles.button, showOnlyUnread && styles.active]}
        activeOpacity={0.7}
      >
        <Ionicons
          name="filter"
          size={16}
          color={showOnlyUnread ? THEME.colors.white : THEME.colors.textDark}
        />
        <Text style={[styles.text, showOnlyUnread && styles.textActive]}>
          {t(
            `notification.filter.${showOnlyUnread ? "showUnRead" : "showAll"}`
          )}
        </Text>
        {count > 0 && (
          <Text style={[styles.text, showOnlyUnread && styles.textActive]}>
            ({count})
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
    backgroundColor: THEME.colors.grey2Light,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: THEME.radius.sm,
    alignSelf: "flex-start",
  },
  active: {
    backgroundColor: THEME.colors.blue,
  },
  text: {
    fontSize: hp(1.5),
    fontWeight: THEME.fonts.medium,
    color: THEME.colors.textDark,
  },
  textActive: {
    color: THEME.colors.white,
  },
});
