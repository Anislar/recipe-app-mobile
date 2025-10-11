import React, { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  showOnlyUnread: boolean;
}

export const EmptyState: FC<Props> = ({ showOnlyUnread }) => (
  <View style={styles.container}>
    <Ionicons name="notifications-outline" size={64} color="#D1D5DB" />
    <Text style={styles.text}>
      {showOnlyUnread ? "No unread notifications" : "No notifications yet"}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  text: { fontSize: 16, color: "#6B7280", marginTop: 16 },
});
