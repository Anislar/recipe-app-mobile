import React, { Suspense, lazy, FC, useRef, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View, Animated } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { THEME } from "@/constants/theme";

const GitHubButton = lazy(() => import("@/components/auth/github-button"));
const DiscordButton = lazy(() => import("@/components/auth/discord-button"));
const GoogleButton = lazy(() => import("@/components/auth/google-button"));

// Required for iOS/Android to complete the flow
WebBrowser.maybeCompleteAuthSession();

const SocialButtonComponent: FC = () => {
  const buttons = [GitHubButton, DiscordButton, GoogleButton];

  const animatedValues = useRef(
    buttons.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
    }))
  ).current;
  useEffect(() => {
    const animations = animatedValues.map(({ opacity, translateY }, index) => {
      return Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          delay: index * 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          delay: index * 300,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(100, animations).start();
  }, [animatedValues]);

  return (
    <Animated.View style={styles.container}>
      {buttons.map((Button, index) => (
        <Suspense
          key={index}
          fallback={
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={THEME.colors.text} />
            </View>
          }
        >
          <Animated.View
            style={{
              opacity: animatedValues[index].opacity,
              transform: [{ translateY: animatedValues[index].translateY }],
            }}
          >
            <Button />
          </Animated.View>
        </Suspense>
      ))}
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    gap: 20,
  },

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
