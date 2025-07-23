import { BackButton, HeaderTab } from "@/components";
import { THEME } from "@/constants/theme";
import { wp } from "@/helpers/common";
import { Stack } from "expo-router";

const ModalLayout = () => {
  return (
    <Stack
      screenOptions={({ route }) => ({
        presentation: "modal",
        tabBarActiveTintColor: THEME.colors.primaryDark,
        headerTitle: () => (
          <HeaderTab
            style={{
              marginLeft: wp(2),
            }}
            title={route.name}
          />
        ),
        headerLeft: () => <BackButton />,
      })}
    >
      <Stack.Screen name="add-post" />
      <Stack.Screen name="update-person" />
    </Stack>
  );
};

export default ModalLayout;
