import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";
import { LoadingSpinner } from "./loading";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSelectedColors } from "@/store";
interface ButtonProps {
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  hasShadow?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  type?: "primary" | "text";
}

export const Button = ({
  buttonStyle,
  textStyle,
  onPress = () => {},
  title,
  loading,
  disabled,
  hasShadow,
  icon,
  type = "primary",
}: ButtonProps) => {
  const selected = useSelectedColors();
  const shadowStyle = {
    shadowColor: THEME.colors.dark,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };
  if (loading) {
    return (
      <View style={[styles.button, buttonStyle, { backgroundColor: "white" }]}>
        <LoadingSpinner />
      </View>
    );
  }
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: type === "text" ? "white" : selected.primary,
        },
        buttonStyle,
        disabled && { backgroundColor: selected.primary + "90" },
        hasShadow && shadowStyle,
      ]}
      onPress={onPress}
    >
      {icon && <MaterialCommunityIcons name={icon} size={20} color="#fff" />}
      <Text
        style={[
          styles.text,
          type === "text" && { color: selected.primaryDark },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    height: hp(6.6),
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: THEME.radius.xl,
  },
  text: {
    fontSize: hp(2),
    color: "white",
    fontWeight: THEME.fonts.bold,
  },
});
