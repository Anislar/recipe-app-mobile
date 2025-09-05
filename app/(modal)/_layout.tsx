import { HeaderTab } from "@/components";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

const ModalLayout = () => {
  const { t } = useTranslation();

  const titleMap: Record<string, any> = {
    "detail-post": t("modal.detailPost"),
  };
  return (
    <Stack
      screenOptions={({ route }) => ({
        presentation: "modal",
        headerShadowVisible: false,
        headerLeft: () => <></>,
        headerTitle: () => (
          <HeaderTab showBackButton title={titleMap[route.name]} />
        ),
      })}
    >
      <Stack.Screen name="detail-post" />
    </Stack>
  );
};

export default ModalLayout;
