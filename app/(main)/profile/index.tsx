import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

import { Button, ScreenWrapper, Avatar, SettingsItem } from "@/components";

import { useAuthStore } from "@/store";
import { hp, wp } from "@/helpers/common";

import { THEME } from "@/constants/theme";

const Profile = () => {
  const { isLoading, user, logout } = useAuthStore();

  return (
    <ScreenWrapper bg="white">
      <ScrollView style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar
            uri={user?.avatar!}
            size={hp(13)}
            rounded={THEME.radius.xxl * 1.4}
          />
          <Link style={styles.editIcon} asChild href="/(modal)/update-person">
            <Feather name="camera" size={24} color={THEME.colors.text} />
          </Link>
        </View>
        {/* username and role */}
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text style={styles.name}>{user?.name ?? ""}</Text>
          <Text style={styles.infoText}>Role : {user?.role!}</Text>
        </View>

        {/* extra info */}
        <View
          style={{
            marginTop: hp(3),
            flex: 1,
            gap: wp(4),
          }}
        >
          <Text style={styles.label}>Account settings</Text>

          <SettingsItem icon="mail" title="email" subTitle={user?.email!} />
          <View
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: THEME.colors.gray,
            }}
          />

          <SettingsItem
            icon="phone"
            title="Phone Number"
            subTitle={user?.phone!}
          />

          <View
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: THEME.colors.gray,
            }}
          />
          <Text style={styles.label}>Extra info</Text>

          <SettingsItem
            icon="map-pin"
            title="Location"
            subTitle={user?.location!}
          />
          <View
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: THEME.colors.gray,
            }}
          />
          <SettingsItem icon="info" title="Bio" subTitle={user?.bio!} />
          <View
            style={{
              marginTop: 20,
            }}
          >
            <Button
              title="Logout"
              loading={isLoading}
              hasShadow
              buttonStyle={{
                backgroundColor: THEME.colors.rose,
                height: hp(6),
                marginHorizontal: wp(5),
                gap: wp(1),
              }}
              onPress={logout}
              icon="log-out"
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: wp(3), gap: hp(2) },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
    marginBottom: hp(2),
  },
  editIcon: {
    position: "absolute",
    bottom: -20,
    right: -20,
    padding: 7,
    borderRadius: 50,
    elevation: 7,
    shadowColor: THEME.colors.textDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    backgroundColor: "white",
  },
  name: {
    fontSize: hp(3),
    fontWeight: THEME.fonts.medium,
    color: THEME.colors.textDark,
  },
  label: {
    fontSize: hp(1.7),
    fontWeight: THEME.fonts.medium,
    color: THEME.colors.textLight,
  },
  infoText: {
    fontSize: hp(1.6),
    color: THEME.colors.textLight,
  },

  infoContainer: {
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default Profile;
