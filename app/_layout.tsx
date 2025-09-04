import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, usePathname } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { I18nextProvider } from "react-i18next";

import { ErrorBoundary } from "@/components";
import { useAuthStore } from "@/store";
import { DefaultFallback } from "@/components/with-suspense";

import i18n, { loadStoredLanguage } from "../language/i18n";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  // Get auth state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    async function prepare() {
      try {
        await loadStoredLanguage();
      } catch {
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return <DefaultFallback isReady={appIsReady} />;
  }

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <ErrorBoundary>
        <KeyboardProvider>
          <I18nextProvider i18n={i18n} defaultNS={"translation"}>
            <RootSiblingParent>
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
            </RootSiblingParent>
          </I18nextProvider>
        </KeyboardProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
