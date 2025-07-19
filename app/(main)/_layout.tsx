import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Tabs } from "expo-router";

import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Avatar from "@/components/avatar";
import { useAuthStore } from "@/store";
import HeaderMain from "@/components/main/header";
import { capitalize } from "@/helpers/utils";

const MainLayout = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: THEME.colors.primaryDark,

        headerTitle: () => (
          <HeaderMain showBackButton title={capitalize(route.name)} />
        ),

        headerTitleStyle: {
          fontWeight: THEME.fonts.bold,
          fontSize: hp(3.2),
          color: THEME.colors.text,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "LinkUp",
          tabBarIcon: ({ color, size }) => (
            <Ionicons size={size} name="home" color={color} />
          ),
          title: "Home",
          headerRight: () => (
            <Link href="/modal/add-post" asChild>
              <Ionicons
                style={{
                  marginHorizontal: wp(3),
                }}
                size={26}
                name="add-circle-outline"
              />
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons size={size} name="search" color={color} />
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
                borderColor: color,
                borderWidth: 2,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default MainLayout;
