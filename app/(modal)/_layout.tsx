import { Stack } from "expo-router";

import { HeaderTab } from "@/components";
import { THEME } from "@/constants/theme";
import { wp } from "@/helpers/common";
import { useTranslation } from "react-i18next";
import { useSelectedColors } from "@/store/themeStore";

const ModalLayout = () => {
  const { t } = useTranslation();
  const selected = useSelectedColors();

  const titleMap: Record<string, string> = {
    "add-post": t("modal.addPost"),
    "update-person": t("modal.editProfile"),
  };

  return (
    <Stack
      screenOptions={({ route }) => ({
        presentation: "modal",
        tabBarActiveTintColor: selected.primaryDark,
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
      <Stack.Screen name="add-post" />
      <Stack.Screen name="update-person" />
    </Stack>
  );
};

export default ModalLayout;
