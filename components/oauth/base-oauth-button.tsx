import React from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { authStyles } from "@/assets/styles/auth.style";

export interface OAuthButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const BaseOAuthButton: React.FC<OAuthButtonProps> = ({
  icon,
  onPress,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        authStyles.socialButton,
        (isLoading || disabled) && authStyles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#666" />
      ) : (
        <Ionicons name={icon} size={26} />
      )}
    </TouchableOpacity>
  );
};

export default BaseOAuthButton;
