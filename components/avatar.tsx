import { StyleProp, StyleSheet, Text, View } from "react-native";
import { Image, ImageStyle } from "expo-image";
import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";
import { getUserImage } from "@/helpers/user.utils";

interface AvatarProps {
  uri?: string;
  size?: number;
  name?: string;
  rounded?: number;
  style?: StyleProp<ImageStyle>;
}

export const Avatar = ({
  uri,
  name = "?",
  size = hp(4.5),
  rounded = THEME.radius.md,
  style,
}: AvatarProps) => {
  const sizeStyle = {
    height: size,
    width: size,
    borderRadius: rounded,
  };

  if (!uri) {
    return (
      <View style={[styles.container, sizeStyle, style]}>
        <Text style={styles.text}>{name.charAt(0).toUpperCase()}</Text>
      </View>
    );
  }

  return (
    <Image
      source={getUserImage(uri)}
      transition={100}
      style={[styles.container, sizeStyle, style]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
    borderColor: THEME.colors.text,
    borderWidth: 1.5,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  text: {
    color: "#fff",
    fontWeight: THEME.fonts.medium,
    fontSize: hp(1.8),
  },
});
