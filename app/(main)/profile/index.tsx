import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

import { Avatar, Button, Separator, SettingsItem } from "@/components";
import { THEME } from "@/constants/theme";
import { useAuthStore } from "@/store";
import { hp } from "@/helpers/common";
import { capitalize } from "@/helpers/utils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface OptionType {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  label?: string;
  isSeperator?: boolean;
  onPress?: () => void;
}
export default function Profile() {
  const { user, logout } = useAuthStore();

  const options: OptionType[] = [
    { icon: "account-cog-outline", label: "Settings" },
    { icon: "map-marker", label: "Address" },
    { icon: "lock", label: "Change Password" },
    { isSeperator: true },
    { icon: "help-circle-outline", label: "Help & Support" },
    { icon: "logout", label: "Log out", onPress: () => logout() },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Avatar uri={user?.avatar!} size={130} rounded={THEME.radius.xxl * 3} />

        <Text style={styles.name}>{capitalize(user?.name ?? "")} </Text>
        <View style={styles.statusContainer}>
          <Text
            style={{
              color: THEME.colors.text,
            }}
          >
            Status:
          </Text>
          <View
            style={[
              styles.status,
              {
                backgroundColor: user?.isActive ? "green" : "red",
              },
            ]}
          />
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

      <Separator my={hp(2)} />
      {options.map(
        ({ icon, label, isSeperator, onPress }: OptionType, index) => (
          <SettingsItem
            onPress={onPress}
            key={index}
            title={label!}
            icon={icon!}
            isSeperator={isSeperator}
            showArrow={label !== "Log out"}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  backButton: { position: "absolute", top: 20, left: 20, zIndex: 1 },
  profileSection: { alignItems: "center" },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  username: { color: "#777", marginBottom: 10 },
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
});
