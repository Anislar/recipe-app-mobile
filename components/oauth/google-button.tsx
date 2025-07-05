import React, { useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import BaseOAuthButton from "./base-oauth-button";
import { oauthService } from "@/services";
import { useAuthStore } from "@/store/authStore";

// Required for iOS/Android to complete the flow
WebBrowser.maybeCompleteAuthSession();

const GoogleButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithGoogle } = useAuthStore();

  // Build the redirect URI (Expo Go or standalone)
  const redirectUri = AuthSession.makeRedirectUri({});

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
      scopes: ["openid", "email", "profile"],
      responseType: AuthSession.ResponseType.Code,
      redirectUri, // use computed value, not from a service
    },
    { authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth" } // Required in SDK 49+
  );

  useEffect(() => {
    if (response?.type === "success" && response.params?.code) {
      handleOAuthResponse(response.params.code);
    }
  }, [response]);

  const handleOAuthResponse = async (code: string) => {
    setIsLoading(true);
    try {
      // Send `code` to your backend for token exchange
      // await oauthService.handleOAuthCallback("google", { code });
      console.log("🚀 ~ handleOAuthResponse ~ code:", code);
      await loginWithGoogle();
    } catch (error) {
      console.error("Google OAuth error:", error);
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
      icon="logo-google"
      onPress={handlePress}
      isLoading={isLoading}
    />
  );
};

export default GoogleButton;
