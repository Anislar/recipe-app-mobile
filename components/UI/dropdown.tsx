import { Ref } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Dropdown, IDropdownRef } from "react-native-element-dropdown";
import { DropdownProps } from "react-native-element-dropdown/lib/typescript/components/Dropdown/model";
import Ionicons from "@expo/vector-icons/Ionicons";

import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";

interface DropdownComponentProps
  extends Omit<DropdownProps<Record<string, string>>, "ref"> {
  style?: StyleProp<ViewStyle>;
  ref: Ref<IDropdownRef>;
  label?: string;
}

const DropdownComponent = ({
  label,
  style,
  onChange,
  ref,
  ...props
}: DropdownComponentProps) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Dropdown
        renderItem={(item) => (
          <View
            style={{
              flexDirection: "row",
              margin: 5,
            }}
          >
            <Ionicons
              name={item.icon}
              size={18}
              color={THEME.colors.text}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: hp(1.6),
                color: THEME.colors.text,
              }}
            >
              {item.label}
            </Text>
          </View>
        )}
        {...props}
        ref={ref}
        placeholder="Select"
        onChange={onChange}
      />
    </View>
  );
};

DropdownComponent.displayName = "DropdownComponent";

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.3,
    borderColor: THEME.colors.textLight,
    borderRadius: THEME.radius.xxl,
    borderCurve: "continuous",
    padding: wp(4),
    height: hp(8),
    justifyContent: "center",
  },
  label: {
    color: THEME.colors.gray,
    fontSize: hp(1.5),
    marginBottom: 2,
    textTransform: "capitalize",
    letterSpacing: wp(0.1),
  },
});
