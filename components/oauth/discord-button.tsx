import React, { useState } from "react";
import { Platform } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import BaseOAuthButton from "./base-oauth-button";
import { useAuthStore } from "@/store/authStore";
import { oauthService } from "@/services";

WebBrowser.maybeCompleteAuthSession();

const DiscordButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithDiscord } = useAuthStore();

  const redirectUri = AuthSession.makeRedirectUri({
    native: "com.anonymous.frontend",
  });

  const handleOAuthResponse = async (url: string) => {
    const code = new URL(url).searchParams.get("code");

    if (!code) return;

    setIsLoading(true);
    try {
      console.log("🚀 ~ handleOAuthResponse ~ code:", code);
      //   await oauthService.handleOAuthCallback("discord", {
      //     type: "success",
      //     params: { code },
      //   });

      await loginWithDiscord();
    } catch (error) {
      console.error("Discord OAuth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePress = async () => {
    const queryParams = new URLSearchParams({
      client_id: process.env.EXPO_PUBLIC_DISCORD_CLIENT_ID!,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "identify email",
      prompt: "consent",
    });

    const authUrl = `https://discord.com/api/oauth2/authorize?${queryParams.toString()}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === "success" && result.url.includes("code=")) {
      await handleOAuthResponse(result.url);
    } else {
      console.warn("OAuth cancelled or failed:", result);
    }
  };

  return (
    <BaseOAuthButton
      icon="logo-discord"
      onPress={handlePress}
      isLoading={isLoading}
    />
  );
};

export default DiscordButton;
