import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { capitalize } from "@/helpers/utils";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";

interface ISettingsItem {
  title: string;
  subTitle: string;
  icon: keyof typeof Feather.glyphMap;
  showArrow?: boolean;
}
export const SettingsItem = ({
  title,
  subTitle,
  showArrow,
  icon,
}: ISettingsItem) => {
  return (
    <View style={[styles.infoContainer, { justifyContent: "space-between" }]}>
      <View style={[styles.infoContainer, { alignItems: "flex-start" }]}>
        <Feather
          name={icon}
          style={{
            marginTop: 2,
          }}
          size={20}
          color="#4b5563"
        />
        <View>
          <Text
            style={[
              styles.label,
              { fontSize: hp(2), color: THEME.colors.textDark },
            ]}
          >
            {capitalize(title)}
          </Text>
          <Text
            numberOfLines={4}
            style={[styles.label, { marginRight: wp(8) }]}
          >
            {subTitle || "N/A"}
          </Text>
        </View>
      </View>

      {showArrow && <Feather name="chevron-right" size={20} color="#4b5563" />}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: hp(1.7),
    fontWeight: THEME.fonts.medium,
    color: THEME.colors.textLight,
  },
  infoText: {
    fontSize: hp(1.6),
    color: THEME.colors.textLight,
  },

  infoContainer: {
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
