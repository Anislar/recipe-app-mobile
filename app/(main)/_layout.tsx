import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

import { HeaderTab, PlusButton } from "@/components";
import { THEME } from "@/constants/theme";
import { useSelectedColors } from "@/store";

const MainLayout = () => {
  const { t } = useTranslation();
  const selected = useSelectedColors();

  const titleMap: Record<string, any> = {
    index: {
      title: t("home.titleTab"),
      suffixIcon: (
        <MaterialCommunityIcons
          onPress={() => router.push("/notification")}
          size={32}
          name="bell-outline"
          color={THEME.colors.text}
        />
      ),
    },
    search: { title: t("search.titleTab"), suffixIcon: null },
    notification: { title: t("notification.titleTab"), suffixIcon: null },
    account: { title: t("account.titleTab"), suffixIcon: null },
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: selected.primaryDark,
        headerShadowVisible: false,
        headerTitle: () => (
          <HeaderTab
            titleStyle={{
              textAlign: route.name === "index" ? "auto" : "center",
            }}
            showBackButton={route.name !== "index"}
            title={titleMap[route.name]?.title || route.name}
            suffixIcon={titleMap[route.name]?.suffixIcon}
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
        name="notification"
        options={{
          title: t("notification.titleTab"),
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              size={size}
              name={focused ? "bell" : "bell-outline"}
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
  );
};

export default MainLayout;
