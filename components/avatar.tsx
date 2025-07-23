import { StyleProp, StyleSheet } from "react-native";
import { Image, ImageStyle } from "expo-image";
import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";
import { getUserImage } from "@/helpers/user.utils";

interface AvatarProps {
  uri: string;
  size: number;
  rounded?: number;
  style?: StyleProp<ImageStyle>;
}
export const Avatar = ({
  uri,
  size = hp(4.5),
  rounded = THEME.radius.md,
  style,
}: AvatarProps) => {
  return (
    <Image
      source={getUserImage(uri)}
      transition={100}
      style={[
        styles.avatar,
        { height: size, width: size, borderRadius: rounded },
        style,
      ]}
    />
  );
};
const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderColor: THEME.colors.text,
    borderWidth: 1,
  },
});
