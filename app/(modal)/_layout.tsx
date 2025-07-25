import { Stack } from "expo-router";

import { HeaderTab } from "@/components";
import { THEME } from "@/constants/theme";
import { wp } from "@/helpers/common";

const ModalLayout = () => {
  const titleMap: Record<string, string> = {
    "add-post": "New Post",
    "update-person": "Edit Profile",
  };

  return (
    <Stack
      screenOptions={({ route }) => ({
        presentation: "modal",
        tabBarActiveTintColor: THEME.colors.primaryDark,
        headerShadowVisible: false,
        headerTitle: () => (
          <HeaderTab
            showBackButton
            style={{
              marginLeft: wp(2),
            }}
            title={titleMap[route.name]}
          />
        ),
        headerLeft: () => <></>,
      })}
    >
      <Stack.Screen name="add-post" options={{ title: "Add post" }} />
      <Stack.Screen name="update-person" options={{ title: "Edit Profile" }} />
    </Stack>
  );
};

export default ModalLayout;
