import {
  memo,
  useCallback,
  useMemo,
  useState,
  useTransition,
  lazy,
  Suspense,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Share,
  Platform,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { Post } from "@/helpers/post";
import { User } from "@/helpers/auth";
import { formatDate } from "@/helpers/utils";
import { usePostMutations } from "@/hooks/post/useMutationPost";
import { useAuthStore } from "@/store";
import { showToast } from "@/helpers/toastService";

import { Avatar } from "../avatar";
import { ContextMenu } from "../UI/context-menu";
import { PostContent } from "./post-content";
import { FullscreenImage } from "../UI/image";
import { LoadingSpinner } from "../UI/loading";
import { categories } from "@/helpers/post/utils";
import { Separator } from "../UI/separator";

const ModalConfirm = lazy(() =>
  import("../UI/modal-confirm").then((mod) => ({ default: mod.ModalConfirm }))
);

interface PostCardProps {
  post: Partial<Post> & { user: Partial<User> };
  index: number;
  showAction?: boolean;
}

export const PostCard = memo(
  ({ post, showAction = true, index }: PostCardProps) => {
    const userId = useAuthStore((s) => s.user?.id);
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [isPending, startTransition] = useTransition();

    const {
      remove: { mutateAsync: deletePost, isPending: isLoading, error, isError },
      setLike: { mutateAsync: likePost },
    } = usePostMutations();

    /** Memoized computations */
    const categorie = useMemo(
      () => categories.find((c) => c.id === post.category),
      [post.category]
    );
    const formattedDate = useMemo(
      () => formatDate(post.createdAt),
      [post.createdAt]
    );

    /** Callbacks */
    const handleDeletePost = useCallback(async () => {
      await deletePost(post.id!);
      setIsVisible(false);
    }, [deletePost, post.id]);

    const handleLike = useCallback(() => {
      startTransition(() => {
        post.is_liked = !post.is_liked;
        post.likes_count = (post.likes_count || 0) + (post.is_liked ? 1 : -1);
        likePost(post.id!);
      });
    }, [post, likePost]);

    const handleShare = useCallback(
      async (noMessage = false) => {
        try {
          let message = "";
          if (post.content && !noMessage) message += `📝 ${post.content}\n\n`;
          if (post.file) message += `📎 Check this out: ${post.file}\n\n`;
          message += "🔗 Shared via link-up — discover more posts!";

          await Share.share(
            {
              message,
              url: Platform.OS === "ios" && post.file ? post.file : undefined,
            },
            { dialogTitle: "Share this post" }
          );
        } catch (err: any) {
          Alert.alert("Error sharing post", err.message || "");
        }
      },
      [post.content, post.file]
    );

    const handleAction = useCallback(
      async (action: "update" | "delete" | "share" | "download") => {
        switch (action) {
          case "update":
            router.push({
              pathname: "/add-post",
              params: { post: JSON.stringify(post) },
            });
            break;
          case "delete":
            setIsVisible(true);
            break;
          case "share":
            handleShare(true);
            break;
          case "download":
            try {
              const fileUri = FileSystem.documentDirectory + "file.png";
              await FileSystem.downloadAsync(post.file!, fileUri);
              showToast("Download Complete!");
            } catch {
              showToast("Could not download the file!");
            }
            break;
        }
      },
      [handleShare, post]
    );

    const shouldAnimate = index < 10;
    const animationDelay = shouldAnimate ? index * 50 : 0;

    /** Render Action Buttons */
    const renderActionButton = (
      icon: string,
      label: string | number,
      onPress?: () => void,
      active = false
    ) => (
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onPress}
        disabled={isPending}
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
      <Animated.View
        entering={
          shouldAnimate
            ? FadeInDown.delay(animationDelay).duration(300)
            : undefined
        }
        style={styles.postCard}
      >
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(modal)/detail-post",
              params: { id: String(post.id ?? "") },
            })
          }
        >
          {/* Header */}
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

          {/* Content */}
          <PostContent content={post.content!} />

          {post.file && (
            <FullscreenImage
              source={{ uri: post.file }}
              onAction={(type) => handleAction(type as "share" | "download")}
            />
          )}

          {/* Footer Actions */}
          {showAction && (
            <>
              <Separator mx={0} bg={THEME.colors.grey2Light} />
              <View style={styles.postActions}>
                {renderActionButton(
                  post.is_liked ? "heart" : "heart-outline",
                  post.likes_count!,
                  handleLike,
                  post.is_liked
                )}
                {renderActionButton("chatbubble-outline", 0)}
                {renderActionButton("share-outline", "", () =>
                  handleShare(false)
                )}
              </View>
            </>
          )}

          {/* Delete Confirmation */}
          {isVisible && (
            <Suspense fallback={<LoadingSpinner />}>
              <ModalConfirm
                isVisible={isVisible}
                isDanger
                isLoading={isLoading}
                error={isError ? error.message : ""}
                close={() => setIsVisible(false)}
                onSubmit={handleDeletePost}
              />
            </Suspense>
          )}
        </Pressable>
      </Animated.View>
    );
  }
);

PostCard.displayName = "PostCard";

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: "#ffffff",
    marginBottom: 1,
    paddingHorizontal: wp(6),
    paddingVertical: 16,
  },
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
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(0.5),
  },
  actionButton: { flexDirection: "row", alignItems: "center", padding: 8 },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
});
