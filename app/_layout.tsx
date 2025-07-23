import { ErrorBoundary } from "@/components";
import { useAuthStore } from "@/store";
import { Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <RootSiblingParent>
      <ErrorBoundary>
        <KeyboardProvider>
          <Stack
            screenOptions={{ animation: "simple_push", headerShown: false }}
          >
            {/* Private route */}
            <Stack.Protected guard={isAuthenticated}>
              <Stack.Screen name="(main)" />
              <Stack.Screen name="(modal)" />
            </Stack.Protected>
            {/* Public route */}
            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen name="welcome" />
              <Stack.Screen name="(auth)" />
            </Stack.Protected>
          </Stack>
        </KeyboardProvider>
      </ErrorBoundary>
    </RootSiblingParent>
  );
}
