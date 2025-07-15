import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as Linking from "expo-linking";

const AuthLayout = () => {
  useEffect(() => {
    const subscription = Linking.addEventListener("url", (event) => {
      const data = Linking.parse(event.url);
      if (data.path === "verify" && data.queryParams?.token) {
        // navigate to Verify screen with token
        console.log("---", data.queryParams);
      }
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        const data = Linking.parse(url);
        // Handle cold start
        if (data.path === "verify" && data.queryParams?.token) {
          console.log("---", data.queryParams);
        }
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="new-password" />
      </Stack>
    </>
  );
};

export default AuthLayout;
