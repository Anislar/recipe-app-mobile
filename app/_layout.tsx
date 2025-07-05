import { useAuthStore } from "@/store";
import { Slot, Stack } from "expo-router";

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
