import { View, Text, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "./back-button";
import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import { capitalize } from "@/helpers/utils";

interface IHeaderMain {
  title: string;
  showBackButton?: boolean;
  style?: StyleProp<ViewStyle>;
}
export const HeaderTab = ({ title, showBackButton, style }: IHeaderMain) => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, style, { paddingTop: -top }]}>
      {showBackButton && <BackButton />}
      <Text
        style={[
          styles.title,
          showBackButton && {
            width: wp(70),
          },
        ]}
      >
        {capitalize(title) || ""}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  title: {
    alignContent: "center",
    textAlign: "center",
    fontSize: hp(2.7),
    fontWeight: THEME.fonts.semibold,
    color: THEME.colors.text,
  },
});
