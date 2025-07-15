// import React, { useState, useCallback } from "react";
// import {
//   GoogleSignin,
//   SignInResponse,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
// import BaseOAuthButton from "./base-oauth-button";
// import { useAuthStore } from "@/store/authStore";

// const GoogleButton: React.FC = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { loginWithGoogle } = useAuthStore();

//   const handlePress = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       await GoogleSignin.hasPlayServices({
//         showPlayServicesUpdateDialog: true,
//       });

//       // Optional: Force user to select account again
//       await GoogleSignin.signOut();

//       const { data, type }: SignInResponse = await GoogleSignin.signIn();
//       // const idToken = await GoogleSignin.getTokens();

//       if (!data) {
//         console.warn("No user info or ID token returned from Google");
//         return;
//       }
//       console.log("🚀 ~ data:", data);

//       // Send ID token to your backend
//       // await loginWithGoogle(idToken.idToken);
//     } catch (error: any) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         console.log("❌ User cancelled Google login");
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         console.log("⏳ Google login already in progress");
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         console.error("❌ Google Play Services not available or outdated");
//       } else {
//         console.error("❗ Unexpected Google Sign-In error:", error);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   return (
//     <BaseOAuthButton
//       title="Continue With Google"
//       icon="logo-google"
//       onPress={handlePress}
//       isLoading={isLoading}
//       disabled={isLoading}
//     />
//   );
// };

// export default GoogleButton;
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
      icon="logo-google"
      onPress={handlePress}
      isLoading={isLoading}
      disabled={!request}
    />
  );
};

export default GoogleButton;
