import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { THEME } from "@/constants/colors";
import { hp } from "@/helpers/common";
import LoadingSpinner from "./loading";
interface ButtonProps {
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
  title: string;
  loading: boolean;
  hasShadow?: boolean;
}

const Button = ({
  buttonStyle,
  textStyle,
  onPress,
  title,
  loading,
  hasShadow,
}: ButtonProps) => {
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
      style={[styles.button, buttonStyle, hasShadow && shadowStyle]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: THEME.colors.primary,
    height: hp(6.6),
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: THEME.radius.xl,
  },
  text: {
    fontSize: hp(2.5),
    color: "white",
    fontWeight: THEME.fonts.bold,
  },
});
