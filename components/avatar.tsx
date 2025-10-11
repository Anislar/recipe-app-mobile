import { StyleProp, StyleSheet, Text, View } from "react-native";
import { Image, ImageStyle } from "expo-image";
import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";
import { useSelectedColors } from "@/store";

interface AvatarProps {
  uri?: string;
  size?: number;
  name?: string;
  rounded?: number;
  style?: StyleProp<ImageStyle>;
  fontSize?: number;
}

export const Avatar = ({
  uri,
  name = "?",
  size = hp(4.5),
  rounded = THEME.radius.md,
  style,
  fontSize,
}: AvatarProps) => {
  const { primary } = useSelectedColors();
  const sizeStyle = {
    height: size,
    width: size,
    borderRadius: rounded,
  };

  if (!uri) {
    return (
      <View
        style={[
          styles.container,
          sizeStyle,
          {
            backgroundColor: primary,
          },
          style,
        ]}
      >
        <Text style={[styles.text, { fontSize }]}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
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
