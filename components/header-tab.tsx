import { View, Text, StyleProp, StyleSheet, TextStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "./back-button";
import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import { capitalize } from "@/helpers/utils";

interface IHeaderMain {
  title: string;
  showBackButton?: boolean;
  style?: StyleProp<TextStyle>;
  cb?: () => void;
}
export const HeaderTab = ({
  title,
  showBackButton,
  style,
  cb,
}: IHeaderMain) => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: -top }]}>
      {showBackButton && <BackButton cb={cb} />}
      <Text
        style={[
          styles.title,
          style,
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
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    textAlign: "center",
    fontSize: hp(2.7),
    fontWeight: THEME.fonts.semibold,
    color: THEME.colors.text,
  },
});
