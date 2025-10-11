import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { Avatar } from "@/components/avatar";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { formatTimeAgo } from "@/helpers/utils";
import { Comment } from "@/type";

interface ReplyItemProps {
  comment: Comment;
  onLike?: (id: string) => void;
}

export const ReplyItem = React.memo(({ comment, onLike }: ReplyItemProps) => {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const isOptimistic = String(comment?.id)?.startsWith("temp-");

  const handleLikePress = useCallback(() => {
    startTransition(() => {
      comment.is_liked = !comment.is_liked;
      comment.likes_count =
        (comment.likes_count || 0) + (comment.is_liked ? 1 : -1);
      onLike?.(comment?.id);
    });
  }, [comment, onLike]);

  const formattedDate = useMemo(
    () => formatTimeAgo(comment.createdAt!),
    [comment.createdAt]
  );

  return (
    <Animated.View
      entering={FadeIn.delay(100)}
      exiting={FadeOut}
      style={styles.commentItem}
    >
      {isOptimistic && <Animated.View style={styles.backdrop} />}

      <View style={styles.commentHeader}>
        <Avatar
          name={comment.user.name}
          uri={comment.user.avatar!}
          size={wp(9)}
          rounded={wp(9)}
        />

        <View style={styles.commentMeta}>
          <Text style={styles.authorName}>{comment.user.name}</Text>
          <Text style={styles.commentTime}>
            {formattedDate}
            {comment.is_edited && " • " + t("post.comment.edited")}
          </Text>
        </View>
      </View>

      <Text style={styles.commentContent}>{comment.content}</Text>

      <View style={styles.commentActions}>
        <TouchableOpacity
          disabled={isPending}
          style={styles.actionButton}
          onPress={handleLikePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={comment.is_liked ? "heart" : "heart-outline"}
            size={16}
            color={comment.is_liked ? "#ff6b6b" : "#666"}
          />
          <Text
            style={[styles.actionText, comment.is_liked && styles.likedText]}
          >
            {comment?.likes_count ?? 0}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  commentItem: {
    paddingVertical: 12,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.05)",
    zIndex: 1,
    borderRadius: 5,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: wp(3),
  },
  commentMeta: {
    flex: 1,
  },
  authorName: {
    fontWeight: THEME.fonts.semibold,
    fontSize: 14,
    color: THEME.colors.text,
  },
  commentTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  commentContent: {
    fontSize: hp(1.8),
    color: THEME.colors.text,
    lineHeight: 20,
    marginBottom: 12,
    marginLeft: wp(12),
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(2),
    paddingHorizontal: wp(1),
    marginBottom: hp(1),
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: hp(1.4),
    color: THEME.colors.grey2,
  },
  likedText: {
    color: "#ff6b6b",
  },
});

ReplyItem.displayName = "ReplyItem";
