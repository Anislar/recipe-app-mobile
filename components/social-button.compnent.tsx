import React, { Suspense, lazy, FC } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { THEME } from "@/constants/colors";
import { wp } from "@/helpers/common";

const GitHubButton = lazy(() => import("@/components/oauth/github-button"));
const DiscordButton = lazy(() => import("@/components/oauth/discord-button"));

// Required for iOS/Android to complete the flow
WebBrowser.maybeCompleteAuthSession();

const SocialButtonComponent: FC = () => {
  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
  //     offlineAccess: true,
  //     scopes: ["email", "profile", "openid"],
  //     profileImageSize: 120,
  //   });
  // }, []);
  return (
    <View
      style={{
        justifyContent: "flex-start",
        gap: 20,
      }}
    >
      <Suspense
        fallback={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={THEME.colors.text} />
          </View>
        }
      >
        <GitHubButton />
      </Suspense>
      <Suspense
        fallback={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={THEME.colors.text} />
          </View>
        }
      >
        <DiscordButton />
      </Suspense>
      {/* <GoogleButton /> */}
    </View>
  );
};
const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: THEME.radius.xl,
    borderWidth: 2,
    borderCurve: "continuous",
    color: THEME.colors.text,
    borderColor: THEME.colors.gray,
    width: wp(90),
  },
});

export default SocialButtonComponent;
