import { useClearAuthStateOnFocus } from "@/hooks/useClearError";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  useClearAuthStateOnFocus();

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
        <Stack.Screen name="verify-code-password" />
        <Stack.Screen name="new-password" />
      </Stack>
    </>
  );
};

export default AuthLayout;
