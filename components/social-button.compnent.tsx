import React from "react";
import { View } from "react-native";
import { authStyles } from "@/assets/styles/auth.style";
import { GoogleButton, GitHubButton, DiscordButton } from "./oauth";

const SocialButtonComponent: React.FC = () => {
  return (
    <View style={authStyles.socialContainer}>
      <GitHubButton />
      <DiscordButton />
      <GoogleButton />
    </View>
  );
};

export default SocialButtonComponent;
