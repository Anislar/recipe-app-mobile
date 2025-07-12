import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <Stack>
      <StatusBar style="dark" />
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
