import { View, StyleSheet } from "react-native";
import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";

export const Separator = ({ my = hp(1) }: { my?: number }) => {
  return <View style={[style.separator, { marginVertical: my }]} />;
};
const style = StyleSheet.create({
  separator: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.gray,
  },
});
