import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { Ref } from "react";
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  Switch,
  StyleSheet,
} from "react-native";

interface SwitchComponentProps {
  style?: StyleProp<ViewStyle>;
  label?: string;
  value: boolean;
  ref?: Ref<Switch>;
  onChange: (value: boolean) => void;
}
export const SwitchComponent = ({
  style,
  label,
  value,
  ref,
  onChange,
  ...props
}: SwitchComponentProps) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Switch
        {...props}
        thumbColor={THEME.colors.textLight}
        trackColor={{
          true: THEME.colors.text,
          false: THEME.colors.darkLight,
        }}
        value={value}
        ref={ref}
        onValueChange={onChange}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    borderWidth: 0.3,
    borderColor: THEME.colors.textLight,
    borderRadius: THEME.radius.xxl,
    borderCurve: "continuous",
    padding: wp(4),
    height: hp(8),
  },
  label: {
    color: THEME.colors.gray,
    fontSize: hp(1.5),
    marginBottom: 2,
    textTransform: "capitalize",
    letterSpacing: wp(0.1),
  },
});
