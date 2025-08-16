import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { HeaderTab } from "@/components";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { useSelectedColors } from "@/store";
import { usePostStore } from "@/store/post.store";
import { StyleSheet } from "react-native";

const ModalLayout = () => {
  const { t } = useTranslation();
  const selected = useSelectedColors();
  const setResetPost = usePostStore((state) => state.setResetElement);
  const titleMap: Record<string, any> = {
    "add-post": { title: t("modal.addPost"), onPress: setResetPost },
    "update-person": { title: t("modal.editProfile"), onPress: () => {} },
  };

  return (
    <Stack
      screenOptions={({ route }) => ({
        //presentation: "modal",
        tabBarActiveTintColor: selected.primaryDark,
        headerShadowVisible: false,
        headerTitle: () => (
          <HeaderTab
            showBackButton
            title={titleMap[route.name].title}
            cb={titleMap[route.name].onPress}
            titleStyle={styles.header}
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
const styles = StyleSheet.create({
  header: {
    // flex: 1,
    paddingRight: wp(10),
  },
  post: {
    padding: wp(1.9),
    borderRadius: THEME.radius.xl,
    color: "white",
    fontSize: hp(1.7),
    fontWeight: THEME.fonts.medium,
    textTransform: "capitalize",
  },
});
export default ModalLayout;
