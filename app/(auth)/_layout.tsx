import { useClear } from "@/hooks/useClearError";
import { Stack } from "expo-router";

const AuthLayout = () => {
  useClear();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="password" />
        <Stack.Screen name="verify-code" />
        <Stack.Screen name="oauthredirect" />
      </Stack>
    </>
  );
};

export default AuthLayout;
