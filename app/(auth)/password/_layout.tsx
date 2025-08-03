import { Slot } from "expo-router";
import { HeaderTab } from "@/components";
import { useTranslation } from "react-i18next";

const PasswordLayout = () => {
  const { t } = useTranslation();

  const titleMap: Record<string, string> = {
    forgot: t("auth.forgotPassword.title"),
    new: t("auth.newPassword.createNewPassword"),
  };

  return (
    <Slot
      screenOptions={({ route }) => ({
        headerTitle: () => (
          <HeaderTab
            showBackButton
            title={titleMap[route.name] || route.name}
          />
        ),
      })}
    />
  );
};

export default PasswordLayout;
