import { Link, Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { THEME } from "@/constants/theme";
import { HeaderTab } from "@/components";
import { wp } from "@/helpers/common";

const MainLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: THEME.colors.primaryDark,
        headerShadowVisible: false,
        headerTitle: () => (
          <HeaderTab
            showBackButton={route.name !== "index"}
            title={route.name === "index" ? "LinkUp" : route.name}
          />
        ),
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              size={size}
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
          title: "Home",
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
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              size={size}
              name={focused ? "account" : "account-outline"}
              color={color}
            />
          ),
          // headerRight: () => (
          //   <Link href="/(modal)/update-person" asChild>
          //     <MaterialCommunityIcons
          //       style={{
          //         marginHorizontal: wp(3),
          //       }}
          //       size={26}
          //       color={THEME.colors.text}
          //       name="account-edit-outline"
          //     />
          //   </Link>
          // ),
        }}
      />
    </Tabs>
  );
};

export default MainLayout;
