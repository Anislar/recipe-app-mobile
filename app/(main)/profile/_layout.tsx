import { HeaderTab } from "@/components";
import { Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <Stack
      screenOptions={({ route }) => ({
        headerShadowVisible: false,
        headerLeft: () => <></>,
        headerTitle: () => (
          <HeaderTab
            showBackButton
            title={route.name === "index" ? "Profile" : route.name}
          />
        ),
      })}
    >
      <Stack.Screen name="index" options={{ title: "Profile" }} />
      <Stack.Screen name="app-info" options={{ title: "App Info" }} />
      <Stack.Screen name="help-support" options={{ title: "Help & Support" }} />
      <Stack.Screen name="password" options={{ title: "Change Password" }} />
    </Stack>
  );
};

export default ProfileLayout;
