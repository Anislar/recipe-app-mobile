import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen
        name="forget-password"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen name="reset-password" options={{ presentation: "modal" }} />
    </Stack>
  );
};

export default AuthLayout;
