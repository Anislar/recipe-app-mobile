import { View, StyleSheet } from "react-native";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";

export const Separator = ({
  my = hp(1.5),
  mx = wp(2),
}: {
  my?: number;
  mx?: number;
}) => {
  return (
    <View
      style={[style.separator, { marginVertical: my, marginHorizontal: mx }]}
    />
  );
};
const style = StyleSheet.create({
  separator: {
    opacity: 0.6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.gray,
  },
});
