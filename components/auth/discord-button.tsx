import React, { useState, useEffect } from "react";
import { useAuthRequest } from "expo-auth-session";
import BaseOAuthButton from "./base-oauth-button";
import { useAuthStore } from "@/store";
import { oauthService } from "@/services";

const DiscordButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithDiscord } = useAuthStore();
  const [request, response, promptAsync] = useAuthRequest(
    oauthService.getOAuthConfig("discord").config,
    oauthService.getOAuthConfig("discord").discovery
  );
  useEffect(() => {
    if (response?.type === "success" && response.params?.code) {
      handleOAuthResponse(response.params.code, request?.codeVerifier!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleOAuthResponse = async (code: string, codeVerifier: string) => {
    setIsLoading(true);
    try {
      await loginWithDiscord(code, codeVerifier);
    } catch (error) {
      console.error("Discord OAuth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePress = async () => {
    if (request) {
      await promptAsync();
    }
  };

  return (
    <BaseOAuthButton
      title="Continue With Discord"
      icon="logo-discord"
      onPress={handlePress}
      isLoading={isLoading}
      disabled={!request}
    />
  );
};

export default DiscordButton;
