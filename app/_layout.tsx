import { ErrorBoundary } from "@/components";
import { useAuthStore } from "@/store";
import { Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <RootSiblingParent>
      <ErrorBoundary>
        <Stack screenOptions={{ animation: "simple_push" }}>
          {/* Private route */}
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
          </Stack.Protected>
          {/* Public route */}
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="oauthredirect" options={{ headerShown: false }} />
        </Stack>
      </ErrorBoundary>
    </RootSiblingParent>
  );
}
