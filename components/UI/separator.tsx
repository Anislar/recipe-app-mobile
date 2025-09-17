import { View, StyleSheet } from "react-native";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";

export const Separator = ({
  my = hp(1.5),
  mx = wp(5),
  bg,
}: {
  my?: number;
  mx?: number;
  bg?: string;
}) => {
  return (
    <View
      style={[
        style.separator,
        { backgroundColor: bg, marginVertical: my, marginHorizontal: mx },
      ]}
    />
  );
};
const style = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: THEME.colors.rose,
  },
});
