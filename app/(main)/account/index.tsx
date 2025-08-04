import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { lazy, Suspense, useRef } from "react";

import {
  Avatar,
  Button,
  DropdownComponent,
  LoadingSpinner,
  ScreenWrapper,
  SettingsItem,
  SwitchComponent,
} from "@/components";
import { THEME } from "@/constants/theme";
import { useAuthStore, useSelectedColors } from "@/store";
import { hp, wp } from "@/helpers/common";
import { capitalize } from "@/helpers/utils";
import { Lang, loadLanguageAsync } from "@/language/i18n";

const BottomSheetComponent = lazy(() =>
  import("@/components").then((el) => ({ default: el.BottomSheetComponent }))
);

const ThemeSelect = lazy(() =>
  import("@/components").then((el) => ({ default: el.ThemeSelect }))
);

interface OptionType {
  group: string;
  item?: any[];
}
export default function Account() {
  const { user, logout, setUser } = useAuthStore();
  const { t } = useTranslation();
  const selected = useSelectedColors();

  const themeSheetRef = useRef<any>(null);
  const handleOpenThemeSheet = () => {
    themeSheetRef.current?.snapToIndex(0);
  };
  const options: OptionType[] = [
    {
      group: t("account.preferences"),
      item: [
        {
          icon: "translate",
          label: t("account.language"),
          suffix: (
            <DropdownComponent
              style={styles.suffix}
              labelField="label"
              valueField="value"
              value={user?.preferences?.language ?? "fr"}
              data={Lang}
              onChange={async (item) => {
                setUser({
                  ...user!,
                  preferences: {
                    ...(user?.preferences ?? {}),
                    language: item.value,
                  },
                });
                await loadLanguageAsync(item.value as "fr" | "en");
              }}
            />
          ),
        },
        {
          icon: "bell-outline",
          label: t("account.notification"),
          suffix: (
            <SwitchComponent
              style={styles.suffix}
              value={!!user?.preferences?.notification}
              onChange={(item) =>
                setUser({
                  ...user!,
                  preferences: {
                    ...(user?.preferences ?? {}),
                    notification: item,
                  },
                })
              }
            />
          ),
        },

        {
          icon: "format-color-fill",
          label: t("account.theme"),
          onPress: handleOpenThemeSheet,
        },
      ],
    },
    {
      group: "seperator",
    },
    {
      group: t("account.account"),
      item: [
        {
          icon: "lock",
          label: t("account.editPassword"),
          onPress: () => router.push("/(main)/account/edit-password"),
        },

        {
          icon: "help-circle-outline",
          label: t("account.helpSupport"),
          onPress: () => router.push("/(main)/account/help-support"),
        },
        {
          icon: "information-outline",
          label: t("account.appInfo"),
          onPress: () => router.push("/(main)/account/app-info"),
        },
        {
          isDanger: true,
          icon: "logout",
          label: t("account.logout"),
          onPress: () => logout(),
        },
      ],
    },
  ];

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <Avatar
            uri={user?.avatar!}
            size={130}
            rounded={THEME.radius.xxl * 3}
          />

          <Text style={styles.name}>{capitalize(user?.name ?? "")} </Text>
          <View style={styles.statusContainer}>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
          <Button
            buttonStyle={[
              styles.editBtn,
              { backgroundColor: selected.primaryDark },
            ]}
            textStyle={{ fontSize: hp(2) }}
            title={t("account.edit")}
            loading={false}
            onPress={() => {
              router.push("/(modal)/update-person");
            }}
          />
        </View>

        {options.map((option: OptionType, index) => (
          <SettingsItem
            key={`settings_item_${index}`}
            group={option.group}
            item={option.item!}
          />
        ))}

        <Suspense fallback={<LoadingSpinner />}>
          <BottomSheetComponent snapPoints={["40%"]} ref={themeSheetRef}>
            <ThemeSelect />
          </BottomSheetComponent>
        </Suspense>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileSection: { alignItems: "center", marginBottom: hp(2) },
  name: { fontSize: hp(2.2), fontWeight: THEME.fonts.bold, marginTop: 10 },
  email: {
    color: THEME.colors.darkGray,
    fontSize: hp(1.6),
    fontWeight: THEME.fonts.medium,
  },
  editBtn: {
    height: hp(4),
    paddingHorizontal: 25,
    borderRadius: 10,
  },

  statusContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    marginBottom: 10,
  },
  status: {
    height: hp(1.5),
    width: hp(1.5),
    borderRadius: hp(1),
    borderColor: "black",
    borderWidth: 1,
  },
  suffix: {
    borderWidth: 0,
    justifyContent: "center",
    flex: 1,
    width: wp(20),
    padding: 0,
  },
});
