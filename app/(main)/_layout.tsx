import { Link, Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { HeaderTab } from "@/components";
import { wp } from "@/helpers/common";
import { useTranslation } from "react-i18next";
import { useSelectedColors } from "@/store/themeStore";

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
          headerRight: () => (
            <Link href="/(modal)/add-post" asChild>
              <MaterialCommunityIcons
                style={{
                  marginHorizontal: wp(3),
                }}
                size={26}
                name="plus-box-outline"
              />
            </Link>
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
        name="account"
        options={{
          title: t("account.titleTab"),

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
