import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { THEME } from "@/constants/colors";
import { hp } from "@/helpers/common";

export interface OAuthButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const BaseOAuthButton: React.FC<OAuthButtonProps> = ({
  icon,
  onPress,
  isLoading = false,
  disabled = false,
  title,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.socialButton,
        (isLoading || disabled) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#666" />
      ) : (
        <View style={styles.socialContainer}>
          <Ionicons name={icon} size={26} />
          <Text style={styles.text}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  socialButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: THEME.radius.xl,
    borderWidth: 2,
    borderCurve: "continuous",
    color: THEME.colors.text,
    borderColor: THEME.colors.gray,
    justifyContent: "center",
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  text: {
    fontSize: hp(1.7),
    fontWeight: THEME.fonts.medium,
    color: THEME.colors.text,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
export default BaseOAuthButton;
