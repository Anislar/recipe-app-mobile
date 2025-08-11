import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { HeaderTab } from "@/components";
import { hp, wp } from "@/helpers/common";
import { useSelectedColors } from "@/store";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { THEME } from "@/constants/theme";

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
            title={titleMap[route.name]}
            style={styles.header}
          />
        ),
        headerLeft: () => <></>,
      })}
    >
      <Stack.Screen
        name="add-post"
        options={{
          headerRight: () => (
            <TouchableOpacity>
              <Text
                style={[
                  styles.preview,
                  { backgroundColor: selected.primaryDark },
                ]}
              >
                {t("post.preview")}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="update-person" />
    </Stack>
  );
};
const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
  preview: {
    padding: wp(1.9),
    borderRadius: THEME.radius.xl,
    color: "white",
    fontSize: hp(1.7),
    fontWeight: THEME.fonts.medium,
    textTransform: "capitalize",
  },
});
export default ModalLayout;
