import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

import {
  Avatar,
  Button,
  DropdownComponent,
  SettingsItem,
  SwitchComponent,
} from "@/components";
import { THEME } from "@/constants/theme";
import { useAuthStore } from "@/store";
import { hp, wp } from "@/helpers/common";
import { capitalize } from "@/helpers/utils";
import { Lang } from "@/language/lang";
import { useTranslation } from "react-i18next";

interface OptionType {
  group: string;
  item?: any[];
}
export default function Profile() {
  const { user, logout, setUser } = useAuthStore();
  const { t, i18n } = useTranslation();
  const options: OptionType[] = [
    {
      group: t("profile.preferences"),
      item: [
        {
          icon: "bell-outline",
          label: t("profile.notification"),
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
          icon: "translate",
          label: t("profile.language"),
          suffix: (
            <DropdownComponent
              style={styles.suffix}
              labelField="label"
              valueField="value"
              value={user?.preferences?.language ?? "fr"}
              data={Lang}
              onChange={(item) => {
                i18n.changeLanguage(item.value);
                setUser({
                  ...user!,
                  preferences: {
                    ...(user?.preferences ?? {}),
                    language: item.value,
                  },
                });
              }}
            />
          ),
        },
        {
          icon: "format-color-fill",
          label: t("profile.theme"),
          onPress: () => {},
        },
      ],
    },
    {
      group: "seperator",
    },
    {
      group: "Account",
      item: [
        {
          icon: "lock",
          label: "Change Password",
          onPress: () => router.push("/(main)/profile/password"),
        },

        {
          icon: "help-circle-outline",
          label: "Help & Support",
          onPress: () => router.push("/(main)/profile/help-support"),
        },
        {
          icon: "information-outline",
          label: "App info",
          onPress: () => router.push("/(main)/profile/app-info"),
        },
        {
          isDanger: true,
          icon: "logout",
          label: "Log out",
          onPress: () => logout(),
        },
      ],
    },

    /*
    📅 Joined: Feb 2023
    📲 App Version: 1.2.0
    */

    /*
    import { getVersion, getBuildNumber } from "react-native-device-info";

    | Item             | Example                                              |
| ---------------- | ---------------------------------------------------- |
| **Version**      | 1.2.3                                                |
| **Build Number** | 42                                                   |
| **Legal Info**   | Link or modal with Terms of Service & Privacy Policy |
| **Last Updated** | July 25, 2025                                        |

    
    */
    // FAQ , Report a backgroundColor
    /*
    FAQ	“How do I reset my password?”
Contact Support	Form with subject & message
Report a Bug	Let user describe the problem, attach screenshot


    
    */
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Avatar uri={user?.avatar!} size={130} rounded={THEME.radius.xxl * 3} />

        <Text style={styles.name}>{capitalize(user?.name ?? "")} </Text>
        <View style={styles.statusContainer}>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <Button
          buttonStyle={styles.editBtn}
          textStyle={{ fontSize: hp(2) }}
          title="Edit Profile"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  profileSection: { alignItems: "center", marginBottom: hp(2) },
  name: { fontSize: hp(2.2), fontWeight: THEME.fonts.bold, marginTop: 10 },
  email: {
    color: THEME.colors.darkGray,
    fontSize: hp(1.6),
    fontWeight: THEME.fonts.medium,
  },
  editBtn: {
    height: hp(4),
    backgroundColor: THEME.colors.primaryDark,
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
