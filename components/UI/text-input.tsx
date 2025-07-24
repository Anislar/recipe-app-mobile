import {
  StyleSheet,
  View,
  type ViewStyle,
  type StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
} from "react-native";
import { Ref } from "react";
import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";
import Feather from "@expo/vector-icons/Feather";

interface TextInputInterface extends TextInputProps {
  containerStyles?: StyleProp<ViewStyle>;
  inputStyles?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
  icon?: keyof typeof Feather.glyphMap;
  suffixIcon?: keyof typeof Feather.glyphMap;
  onPressIcon?: () => void;
  ref?: Ref<TextInput>;
}
const TextInputComponent = ({
  containerStyles,
  inputStyles,
  icon,
  iconStyle,

  suffixIcon,
  onPressIcon,
  ref,
  ...props
}: TextInputInterface) => {
  return (
    <View style={[styles.container, containerStyles]}>
      {icon && <Feather name={icon} size={26} style={iconStyle} />}
      <TextInput
        autoCapitalize="none"
        style={[styles.input, inputStyles]}
        placeholderTextColor={THEME.colors.textLight}
        ref={ref}
        {...props}
      />
      {suffixIcon && (
        <Feather onPress={onPressIcon} name={suffixIcon} size={26} />
      )}
    </View>
  );
};
export default TextInputComponent;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: hp(7.2),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.3,
    borderColor: THEME.colors.text,
    borderRadius: THEME.radius.xxl,
    borderCurve: "continuous",
    paddingHorizontal: 15,
    gap: 12,
  },
  input: {
    flex: 1,
    color: THEME.colors.text,
    fontSize: hp(1.9),
  },
});
