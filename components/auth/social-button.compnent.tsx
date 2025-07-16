import React, { Suspense, lazy, FC } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { THEME } from "@/constants/colors";

const GitHubButton = lazy(() => import("@/components/auth/github-button"));
const DiscordButton = lazy(() => import("@/components/auth/discord-button"));
const GoogleButton = lazy(() => import("@/components/auth/google-button"));

// Required for iOS/Android to complete the flow
WebBrowser.maybeCompleteAuthSession();

const SocialButtonComponent: FC = () => {
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
      <Suspense
        fallback={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={THEME.colors.text} />
          </View>
        }
      >
        <GoogleButton />
      </Suspense>
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
    justifyContent: "center",
  },
});

export default SocialButtonComponent;
