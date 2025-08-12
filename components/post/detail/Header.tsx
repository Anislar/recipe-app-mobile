import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Avatar } from "@/components";
import { hp } from "@/helpers/common";
import { formatTimeAgo } from "../utils";
import { THEME } from "@/constants/theme";

type Props = {
  name: string;
  avatar: string;
  createdAt?: string;
  location?: string;
};

export const PostHeader: React.FC<Props> = ({
  name,
  avatar,
  createdAt,
  location,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Avatar
          size={hp(5)}
          uri={avatar}
          rounded={THEME.radius.xxl}
          style={styles.avatar}
        />
        <View style={styles.userDetails}>
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{name}</Text>
          </View>
          <View style={styles.metaInfo}>
            <Text style={styles.timeAgo}>{formatTimeAgo(createdAt)}</Text>
            {!!location && (
              <>
                <Text style={styles.metaSeparator}>•</Text>
                <View style={styles.locationContainer}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={12}
                    color="#6B7280"
                  />
                  <Text style={styles.location}>{location}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginRight: 6,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeAgo: {
    fontSize: 14,
    color: "#6B7280",
  },
  metaSeparator: {
    fontSize: 14,
    color: "#6B7280",
    marginHorizontal: 6,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 2,
  },
});

export default PostHeader;
