import { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { HeaderTab, PlusButton } from "@/components";
import { useSelectedColors } from "@/store";
import { THEME } from "@/constants/theme";
import { wp } from "@/helpers/common";

const MainLayout = () => {
  const { t } = useTranslation();
  const selected = useSelectedColors();
  const [client] = useState(() => new QueryClient());

  const titleMap: Record<string, any> = {
    index: {
      title: t("home.titleTab"),
      suffixIcon: (
        <MaterialCommunityIcons
          size={32}
          name="bell-outline"
          color={THEME.colors.text}
        />
      ),
    },
    search: { title: t("search.titleTab"), suffixIcon: null },
    chat: { title: t("chat.titleTab"), suffixIcon: null },
    account: { title: t("account.titleTab"), suffixIcon: null },
    "add-post": {
      title: t("modal.addPost"),
      suffixIcon: null,
    },
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
                marginLeft: route.name === "add-post" ? -wp(5) : undefined,

                textAlign: route.name === "index" ? "auto" : "center",
              }}
              showBackButton={route.name !== "index"}
              title={titleMap[route.name].title || route.name}
              suffixIcon={titleMap[route.name].suffixIcon}
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
