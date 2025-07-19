import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { hp, wp } from "@/helpers/common";
import Avatar from "@/components/avatar";
import { useAuthStore } from "@/store";
import { THEME } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { capitalize } from "@/helpers/utils";
import { ScreenWrapper } from "@/components";
const Profile = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View
          style={{
            gap: hp(5),
          }}
        >
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.avatar!}
              size={hp(13)}
              rounded={THEME.radius.xxl * 1.4}
            />
            <Link style={styles.editIcon} asChild href="/">
              <AntDesign name="edit" size={24} />
            </Link>
          </View>
          {/* username and address */}
          <View
            style={{
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text style={styles.name}>{user?.name ?? ""}</Text>
            <Text style={styles.infoText}>{capitalize(user?.role!)}</Text>
          </View>
          {/* extra info */}
          <View
            style={{
              gap: wp(5),
            }}
          >
            <View style={styles.infoContainer}>
              <Ionicons
                name="mail-outline"
                size={26}
                color={THEME.colors.textLight}
              />
              <Text style={[styles.infoText, { fontSize: hp(1.7) }]}>
                {user?.email ?? ""}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Ionicons
                name="call-outline"
                size={26}
                color={THEME.colors.textLight}
              />
              <Text style={[styles.infoText, { fontSize: hp(1.7) }]}>
                {user?.phone ?? "+216000 000 000"}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Ionicons
                name="map-outline"
                size={26}
                color={THEME.colors.textLight}
              />
              <Text style={[styles.infoText, { fontSize: hp(1.7) }]}>
                {user?.location ?? "Tunisie"}
              </Text>
            </View>
            <View style={[styles.infoContainer, { alignItems: "flex-start" }]}>
              <Ionicons
                name="information-circle-outline"
                size={26}
                color={THEME.colors.textLight}
              />
              <Text numberOfLines={5} style={styles.bio}>
                {user?.bio ??
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, margin: wp(5) },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
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
  infoText: {
    fontSize: hp(1.6),
    fontWeight: "400",
    shadowColor: THEME.colors.textLight,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bio: {
    fontSize: hp(1.7),
    marginRight: hp(6),
    fontWeight: "400",
    shadowColor: THEME.colors.textLight,
    textAlign: "justify",
    alignSelf: "flex-start",
  },
});
export default Profile;
