import { useAuthStore } from "@/store";
import { Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();

  return (
    <RootSiblingParent>
      <Stack screenOptions={{ animation: "fade" }}>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </RootSiblingParent>
  );
}
