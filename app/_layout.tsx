import { useAuthStore } from "@/store";
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { RootSiblingParent } from "react-native-root-siblings";

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  useEffect(() => {
    const handleUrl = (url: string) => {
      const { hostname, queryParams } = Linking.parse(url);

      if (hostname === "oauthredirect" && queryParams?.code) {
        // OAuth returned a code
        console.log("OAuth code:", queryParams.code);
        console.log("OAuth state:", queryParams.state);

        // Process OAuth code here
      }
    };

    const subscription = Linking.addEventListener("url", (event) =>
      handleUrl(event.url)
    );

    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    return () => subscription.remove();
  }, []);
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
