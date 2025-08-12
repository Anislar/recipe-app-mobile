import { router, Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { HeaderTab } from "@/components";
import { hp, wp } from "@/helpers/common";
import { useAuthStore, useSelectedColors } from "@/store";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { THEME } from "@/constants/theme";
import { usePostStore } from "@/store/post.store";

const ModalLayout = () => {
  const { t } = useTranslation();
  const selected = useSelectedColors();
  const setResetPost = usePostStore((state) => state.setResetElement);
  const titleMap: Record<string, any> = {
    "add-post": { title: t("modal.addPost"), onPress: setResetPost },
    "detail-post": { title: t("modal.detailPost"), onPress: () => {} },
    "update-person": { title: t("modal.editProfile"), onPress: () => {} },
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
            title={titleMap[route.name].title}
            cb={titleMap[route.name].onPress}
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
            <TouchableOpacity onPress={() => router.push("/detail-post")}>
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
      <Stack.Screen name="detail-post" />
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
