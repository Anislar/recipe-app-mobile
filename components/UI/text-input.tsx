import {
  StyleSheet,
  View,
  type ViewStyle,
  type StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ref } from "react";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { capitalize } from "@/helpers/utils";

interface TextInputInterface extends TextInputProps {
  label?: string;
  containerStyles?: StyleProp<ViewStyle>;
  inputStyles?: StyleProp<TextStyle>;
  suffixIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPressIcon?: () => void;
  ref?: Ref<TextInput>;
}

const TextInputComponent = ({
  label,
  containerStyles,
  inputStyles,
  suffixIcon,
  onPressIcon,
  secureTextEntry,
  ref,
  ...props
}: TextInputInterface) => {
  return (
    <View style={[styles.container, containerStyles]}>
      {label && <Text style={styles.label}>{capitalize(label)}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          ref={ref}
          placeholderTextColor={THEME.colors.textLight}
          secureTextEntry={secureTextEntry}
          style={[styles.input, inputStyles]}
          {...props}
        />

        {suffixIcon && (
          <TouchableOpacity onPress={onPressIcon}>
            <MaterialCommunityIcons
              name={suffixIcon}
              size={24}
              color={THEME.colors.gray}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.3,
    borderColor: THEME.colors.textLight,
    borderRadius: THEME.radius.xxl,
    borderCurve: "continuous",
    padding: wp(4),
    height: hp(9),
    justifyContent: "center",
  },
  label: {
    color: THEME.colors.gray,
    fontSize: hp(1.5),
    marginBottom: 2,
    letterSpacing: wp(0.1),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: THEME.colors.text,
    fontSize: hp(1.8),
    fontWeight: THEME.fonts.medium,
  },
});
