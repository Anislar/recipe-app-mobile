import { useState, useEffect, FC } from "react";
import { useAuthRequest } from "expo-auth-session";
import BaseOAuthButton from "./base-oauth-button";
import { useAuthStore } from "@/store";
import { oauthService } from "@/services";
const GithubButton: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithGithub } = useAuthStore();
  const [request, response, promptAsync] = useAuthRequest(
    oauthService.getOAuthConfig("github").config,
    oauthService.getOAuthConfig("github").discovery
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
      await loginWithGithub(code, codeVerifier);
    } catch (error) {
      console.error("Github OAuth error:", error);
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
      title="Continue With Github"
      color="black"
      icon="logo-github"
      onPress={handlePress}
      isLoading={isLoading}
      disabled={!request}
    />
  );
};

export default GithubButton;
