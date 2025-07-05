import React, { useState } from "react";
import * as AuthSession from "expo-auth-session";
import BaseOAuthButton from "./base-oauth-button";
import { oauthService } from "@/services";
import { useAuthStore } from "@/store/authStore";

const GitHubButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithGithub } = useAuthStore();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
      scopes: ["read:user", "user:email"],
      responseType: "code",
      redirectUri: oauthService.getOAuthConfig("github").redirectUri,
    },
    null
  );
  console.log("🚀 ~ GitHubButton ~ request:", request);

  React.useEffect(() => {
    if (response) {
      handleOAuthResponse(response);
    }
  }, [response]);

  const handleOAuthResponse = async (
    response: AuthSession.AuthSessionResult
  ) => {
    if (response.type === "success" && response.params.code) {
      setIsLoading(true);
      try {
        await oauthService.handleOAuthCallback("github", response);
        await loginWithGithub();
      } catch (error) {
        console.error("GitHub OAuth error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePress = async () => {
    if (request) {
      await promptAsync();
    }
  };

  return (
    <BaseOAuthButton
      icon="logo-github"
      onPress={handlePress}
      isLoading={isLoading}
      //disabled={!request}
    />
  );
};

export default GitHubButton;
