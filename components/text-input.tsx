import {
  StyleSheet,
  View,
  type ViewStyle,
  type StyleProp,
  TextInput,
  TextInputProps,
} from "react-native";
import { Ref } from "react";
import { THEME } from "@/constants/colors";
import { hp } from "@/helpers/common";
import Ionicons from "@expo/vector-icons/Ionicons";

interface TextInputInterface extends TextInputProps {
  containerStyles?: StyleProp<ViewStyle>;
  icon?: keyof typeof Ionicons.glyphMap;
  suffixIcon?: keyof typeof Ionicons.glyphMap;
  onPressIcon?: () => void;
  ref?: Ref<TextInput>;
}
const TextInputComponent = ({
  containerStyles,
  icon,
  suffixIcon,
  onPressIcon,
  ref,
  ...props
}: TextInputInterface) => {
  return (
    <View style={[styles.container, containerStyles]}>
      <Ionicons name={icon} size={26} />
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        placeholderTextColor={THEME.colors.textLight}
        ref={ref}
        {...props}
      />
      <Ionicons onPress={onPressIcon} name={suffixIcon} size={26} />
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
    borderWidth: 0.4,
    borderColor: THEME.colors.text,
    borderRadius: THEME.radius.xxl,
    borderCurve: "continuous",
    paddingHorizontal: 15,
    gap: 12,
  },
  input: { flex: 1, color: THEME.colors.text, fontSize: hp(1.9) },
});
