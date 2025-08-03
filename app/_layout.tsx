import { ErrorBoundary } from "@/components";
import { useAuthStore } from "@/store";
import { Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { I18nextProvider } from "react-i18next";

import i18n from "../language/i18n";

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <RootSiblingParent>
      <ErrorBoundary>
        <KeyboardProvider>
          <I18nextProvider i18n={i18n} defaultNS={"translation"}>
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
          </I18nextProvider>
        </KeyboardProvider>
      </ErrorBoundary>
    </RootSiblingParent>
  );
}
