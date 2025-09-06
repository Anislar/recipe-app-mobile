import Ionicons from "@expo/vector-icons/Ionicons";
import { router, usePathname } from "expo-router";
import React, { FC, memo, useCallback, useTransition } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Separator } from "@/components/UI/separator";

import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";
import { Post } from "@/helpers/post";
import { usePostMutations } from "@/hooks/post/useMutationPost";

interface Props {
  post: Post & {
    user: any;
  };
  handleShare: (noMessage: boolean) => void;
}
export const PostAction: FC<Props> = memo(({ post, handleShare }) => {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const {
    setLike: { mutate },
  } = usePostMutations();

  const handleLike = useCallback(() => {
    startTransition(() => {
      post.is_liked = !post.is_liked;
      post.likes_count = (post.likes_count || 0) + (post.is_liked ? 1 : -1);
      mutate(post.id!);
    });
  }, [post, mutate]);
  // view
  const renderActionButton = ({
    icon,
    label,
    onPress,
    active = false,
    disable = false,
  }: {
    icon: string;
    label: string | number;
    onPress?: () => void;
    active: boolean;
    disable: boolean;
  }) => (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={onPress}
      disabled={disable}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={active ? "#ef4444" : THEME.colors.grey2}
      />
      <Text style={[styles.actionText, active && { color: "#ef4444" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Separator mx={0} bg={THEME.colors.grey2Light} />
      <View style={styles.postActions}>
        {/* like */}
        {renderActionButton({
          icon: post.is_liked ? "heart" : "heart-outline",
          label: post.likes_count!,
          onPress: handleLike,
          active: !!post.is_liked,
          disable: isPending,
        })}
        {/* comment */}
        {renderActionButton({
          icon: "chatbubble-outline",
          label: 0,
          onPress: () =>
            router.push({
              pathname: "/(modal)/detail-post",
              params: { post: JSON.stringify(post) },
            }),
          active: false,
          disable: pathname === "/detail-post",
        })}
        {/* share */}
        {renderActionButton({
          icon: "share-outline",
          label: "",
          onPress: () => handleShare(false),
          active: false,
          disable: false,
        })}
      </View>
    </>
  );
});

PostAction.displayName = "PostAction";
const styles = StyleSheet.create({
  actionButton: { flexDirection: "row", alignItems: "center", padding: 8 },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(0.5),
  },
});
