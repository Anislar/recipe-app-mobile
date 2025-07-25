import { hp, wp } from "@/helpers/common";
//import AntDesign from "@expo/vector-icons/AntDesign";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Separator } from "../UI/separator";
import { THEME } from "@/constants/theme";
interface ISettingsItem {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  showArrow?: boolean;
  isSeperator?: boolean;
  onPress?: () => void;
}
export const SettingsItem = ({
  title,
  showArrow,
  icon,
  isSeperator,
  onPress,
}: ISettingsItem) => {
  return (
    <>
      {isSeperator ? (
        <Separator />
      ) : (
        <TouchableOpacity onPress={onPress} style={styles.optionRow}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={icon} size={20} />
          </View>
          <Text style={styles.optionLabel}>{title}</Text>
          {showArrow && (
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              style={styles.rightIcon}
            />
          )}
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: "#eee",
    padding: 5,
    borderRadius: THEME.radius.xxl,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1),
  },
  optionLabel: { flex: 1, marginLeft: wp(2), fontSize: hp(1.8) },
  rightIcon: { color: THEME.colors.text },
});
