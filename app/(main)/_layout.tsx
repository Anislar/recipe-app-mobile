import { router, Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";

import { HeaderTab } from "@/components";
import { useSelectedColors } from "@/store";

const MainLayout = () => {
  const { t } = useTranslation();
  const selected = useSelectedColors();

  const titleMap: Record<string, string> = {
    index: t("home.titleTab"),
    search: t("search.titleTab"),
    account: t("account.titleTab"),
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: selected.primaryDark,
        headerShadowVisible: false,
        headerTitle: () => (
          <HeaderTab
            showBackButton={route.name !== "index"}
            title={titleMap[route.name] || route.name}
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
          title: t("modal.addPost"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons size={size} name="plus-box" color={color} />
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push("/(modal)/add-post");
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
  );
};

export default MainLayout;
