import React, { useState, useEffect } from "react";
import { useAuthRequest } from "expo-auth-session";
import BaseOAuthButton from "./base-oauth-button";
import { useAuthStore } from "@/store";
import { oauthService } from "@/services";

const GoogleButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithGoogle } = useAuthStore();
  const [request, response, promptAsync] = useAuthRequest(
    oauthService.getOAuthConfig("google").config,
    oauthService.getOAuthConfig("google").discovery
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
      await loginWithGoogle(code, codeVerifier);
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
      title="Continue With Google"
      color="#DB4437"
      icon="logo-google"
      onPress={handlePress}
      isLoading={isLoading}
      disabled={!request}
    />
  );
};

export default GoogleButton;
