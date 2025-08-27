import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { capitalize } from "@/helpers/utils";
import BackButton from "./back-button";

interface IHeaderMain {
  title: string;
  showBackButton?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  suffixIcon?: React.ReactNode;
  cb?: () => void;
}
export const HeaderTab = ({
  title,
  showBackButton,
  titleStyle,
  suffixIcon,
  cb,
}: IHeaderMain) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: wp(!showBackButton ? 90 : 85),
        },
      ]}
    >
      {showBackButton && <BackButton cb={cb} />}
      <Text
        style={[
          styles.title,
          showBackButton && { textAlign: "center" },
          titleStyle,
        ]}
      >
        {capitalize(title) || ""}
      </Text>
      {suffixIcon && <View style={styles.suffixIcon}>{suffixIcon}</View>}
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
    marginLeft: wp(2),
    fontSize: hp(3.5),
    fontWeight: THEME.fonts.semibold,
    color: THEME.colors.text,
    flex: 1,
  },
  suffixIcon: {
    width: wp(20),
    alignItems: "flex-end",
  },
});
