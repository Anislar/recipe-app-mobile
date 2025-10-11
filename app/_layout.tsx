import { useEffect, useState, Suspense } from "react";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components";
import { DefaultFallback } from "@/components/with-suspense";
import { useAuthStore } from "@/store";
import i18n, { loadStoredLanguage } from "../language/i18n";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Get auth state with proper hydration check
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore.persist?.hasHydrated?.() ?? false;

  useEffect(() => {
    let isMounted = true;

    async function initializeApp() {
      try {
        await Promise.all([loadStoredLanguage()]);

        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error("App initialization error:", error);
        if (isMounted) {
          setInitError(
            error instanceof Error ? error.message : "Initialization failed"
          );
        }
      } finally {
        if (isMounted) {
          setAppIsReady(true);
          setTimeout(() => {
            SplashScreen.hideAsync().catch(console.warn);
          }, 200);
        }
      }
    }

    if (isHydrated) {
      initializeApp();
    }

    return () => {
      isMounted = false;
    };
  }, [isHydrated]);

  if (!appIsReady || !isHydrated) {
    return (
      <DefaultFallback isReady={appIsReady && isHydrated} error={initError} />
    );
  }

  if (initError) {
    return <DefaultFallback isReady={false} error={initError} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <KeyboardProvider>
          <I18nextProvider i18n={i18n}>
            <RootSiblingParent>
              <QueryClientProvider client={queryClient}>
                <Suspense fallback={<DefaultFallback isReady={true} />}>
                  <Stack
                    screenOptions={{
                      animation: "simple_push",
                      headerShown: false,
                    }}
                  >
                    {/* Private Routes */}
                    <Stack.Protected guard={isAuthenticated}>
                      <Stack.Screen name="(main)" />
                      <Stack.Screen name="(modal)" />
                    </Stack.Protected>

                    {/* Public Routes */}
                    <Stack.Protected guard={!isAuthenticated}>
                      <Stack.Screen name="welcome" />
                      <Stack.Screen name="(auth)" />
                    </Stack.Protected>
                  </Stack>
                </Suspense>
              </QueryClientProvider>
            </RootSiblingParent>
          </I18nextProvider>
        </KeyboardProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
