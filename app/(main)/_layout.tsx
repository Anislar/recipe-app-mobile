import { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { HeaderTab, PlusButton } from "@/components";
import { useSelectedColors } from "@/store";
import { THEME } from "@/constants/theme";

const MainLayout = () => {
  const { t } = useTranslation();
  const selected = useSelectedColors();
  const [client] = useState(() => new QueryClient());

  const titleMap: Record<string, string> = {
    index: t("home.titleTab"),
    search: t("search.titleTab"),
    account: t("account.titleTab"),
  };

  return (
    <QueryClientProvider client={client}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: selected.primaryDark,
          headerShadowVisible: false,
          headerTitle: () => (
            <HeaderTab
              titleStyle={{
                textAlign: route.name === "index" ? "auto" : undefined,
              }}
              showBackButton={route.name !== "index"}
              title={titleMap[route.name] || route.name}
              suffixIcon={
                route.name === "index" && (
                  <MaterialCommunityIcons
                    size={32}
                    name="bell-outline"
                    color={THEME.colors.text}
                  />
                )
              }
            />
          ),
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("home.titleTab"),
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                size={size}
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: t("search.titleTab"),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                size={size}
                name="text-search"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add-post"
          options={{
            tabBarButton: () => <PlusButton />,
          }}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
            },
          })}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: t("chat.titleTab"),
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                size={size}
                name={focused ? "chat" : "chat-outline"}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="account"
          options={{
            headerShown: false,
            title: t("account.titleTab"),

            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                size={size}
                name={focused ? "account" : "account-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
};

export default MainLayout;
