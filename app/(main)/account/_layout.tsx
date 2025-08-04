import { Stack } from "expo-router";
import { HeaderTab } from "@/components";
import { useTranslation } from "react-i18next";

const AccountLayout = () => {
  const { t } = useTranslation();
  const titleMap: Record<string, string> = {
    index: t("account.account"),
    "app-info": t("appInfo.app"),
    "help-support": t("account.helpSupport"),
    "edit-password": t("account.editPassword"),
  };
  return (
    <Stack
      screenOptions={({ route }) => ({
        headerShadowVisible: false,

        headerLeft: () => <></>,
        headerTitle: () => (
          <HeaderTab
            showBackButton
            title={titleMap[route.name] || route.name}
          />
        ),
      })}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="app-info" />
      <Stack.Screen name="help-support" />
      <Stack.Screen name="edit-password" />
    </Stack>
  );
};

export default AccountLayout;
