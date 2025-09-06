import React, { FC, memo, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { t } from "i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Avatar } from "@/components/avatar";
import { THEME } from "@/constants/theme";
import { ContextMenu } from "@/components/UI/context-menu";

import { hp } from "@/helpers/common";
import { Post } from "@/helpers/post";
import { categories } from "@/helpers/post/utils";
import { formatDate } from "@/helpers/utils";
import { useAuthStore } from "@/store";

interface Props {
  post: Post & {
    user: any;
  };
  showAction: boolean;
  handleAction: (type: "update" | "delete") => void;
}

export const PostHeader: FC<Props> = memo(
  ({ post, showAction, handleAction }) => {
    /** Memoized computations */
    const categorie = useMemo(
      () => categories.find((c) => c.id === post.category),
      [post.category]
    );
    const formattedDate = useMemo(
      () => formatDate(post.createdAt),
      [post.createdAt]
    );
    const userId = useAuthStore((s) => s.user?.id);

    return (
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Avatar
            uri={post.user?.avatar!}
            size={hp(6)}
            style={styles.avatar}
            rounded={THEME.radius.xxl * 2}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {post.user?.name}{" "}
              <Text style={styles.userHandle}>
                •
                <MaterialCommunityIcons
                  size={15}
                  name="map-marker-outline"
                />{" "}
                {post.location ?? "N/A"}
              </Text>
            </Text>
            <Text style={styles.userHandle}>{formattedDate}</Text>
          </View>
        </View>

        <View style={styles.categoryBadge}>
          <Text style={[styles.categoryText, { color: categorie?.color }]}>
            {categorie?.name}
          </Text>
        </View>

        {post.user?.id === userId && showAction && (
          <ContextMenu<"update" | "delete">
            items={[
              {
                type: "update",
                name: t("post.action.update"),
                icon: "pencil-outline",
              },
              {
                type: "delete",
                name: t("post.action.delete"),
                icon: "trash-can-outline",
              },
            ]}
            onAction={handleAction}
            menuWidth={120}
            left={2}
            top={20}
          />
        )}
      </View>
    );
  }
);
PostHeader.displayName = "PostHeader";
const styles = StyleSheet.create({
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: { marginRight: 12 },
  userDetails: { flex: 1 },
  userName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  userHandle: { fontSize: 14, color: THEME.colors.grey2, marginTop: 2 },
  categoryBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 5,
    borderRadius: 12,
  },
  categoryText: { fontSize: 12, fontWeight: "500" },
});
