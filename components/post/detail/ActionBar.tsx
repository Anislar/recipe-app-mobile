import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  likes: number;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
};

export const ActionBar: React.FC<Props> = ({
  likes,
  liked,
  saved,
  onLike,
  onComment,
  onShare,
  onSave,
}) => {
  const ActionButton = ({ icon, active, onPress, count }: any) => (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={active ? "#111827" : "#6B7280"}
      />
      {typeof count === "number" && (
        <Text style={[styles.actionCount, active && { color: "#111827" }]}>
          {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.actionBar}>
      <View style={styles.leftActions}>
        <ActionButton
          icon={liked ? "heart" : "heart-outline"}
          active={liked}
          onPress={onLike}
          count={likes}
        />
        <ActionButton icon="chatbubble-outline" onPress={onComment} />
        <ActionButton icon="paper-plane-outline" onPress={onShare} />
      </View>
      <ActionButton
        icon={saved ? "bookmark" : "bookmark-outline"}
        active={saved}
        onPress={onSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 16,
  },
  actionCount: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 6,
    fontWeight: "500",
  },
});

export default ActionBar;
