import { Link, Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

import { THEME } from "@/constants/theme";
import { useAuthStore } from "@/store";
import { Avatar, HeaderTab } from "@/components";
import { wp } from "@/helpers/common";

const MainLayout = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: THEME.colors.primaryDark,
        headerTitle: () => (
          <HeaderTab title={route.name === "index" ? "LinkUp" : route.name} />
        ),
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather size={size} name="home" color={color} />
          ),
          title: "Home",
          headerRight: () => (
            <Link href="/(modal)/add-post" asChild>
              <Feather
                style={{
                  marginHorizontal: wp(3),
                }}
                size={26}
                name="plus-square"
              />
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather size={size} name="search" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Avatar
              uri={user?.avatar!}
              size={size}
              rounded={THEME.radius.sm}
              style={{
                marginHorizontal: 5,
                borderColor: color,
                borderWidth: 2,
              }}
            />
          ),
          headerRight: () => (
            <Link href="/(modal)/update-person" asChild>
              <Feather
                style={{
                  marginHorizontal: wp(3),
                }}
                size={26}
                color={THEME.colors.text}
                name="edit"
              />
            </Link>
          ),
        }}
      />
    </Tabs>
  );
};

export default MainLayout;
