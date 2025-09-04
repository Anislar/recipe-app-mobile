import { THEME } from "@/constants/theme";
import { User } from "@/helpers/auth";
import { hp, wp } from "@/helpers/common";
import { Post } from "@/helpers/post";
import { categories } from "@/helpers/post/utils";
import { formatDate } from "@/helpers/utils";
import { usePostMutations } from "@/hooks/post/useMutationPost";
import { useAuthStore } from "@/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  Alert,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Avatar } from "../avatar";
import { ContextMenu } from "../UI/context-menu";
import { LoadingSpinner } from "../UI/loading";
import { PostContent } from "./post-content";

const ModalConfirm = lazy(() =>
  import("../UI/modal-confirm").then((module) => ({
    default: module.ModalConfirm,
  }))
);
interface PostCardProps {
  post: Partial<Post> & {
    user: Partial<User>;
  };
  index: number;
  showAction?: boolean;
}
export const PostCard = memo(
  ({ post, showAction = true, index }: PostCardProps) => {
    const userId = useAuthStore((s) => s.user?.id);
    const [isVisible, setIsVisible] = useState(false);

    const {
      remove: { mutateAsync: deletePost, isPending: isLoading, error, isError },
      setLike: { mutateAsync: likePost },
    } = usePostMutations();
    const [isPending, startTransition] = useTransition();

    // Memoize expensive operations
    const categorie = useMemo(
      () => categories.find((cat) => cat.id === post.category),
      [post.category]
    );

    const formattedDate = useMemo(
      () => formatDate(post.createdAt),
      [post.createdAt]
    );

    const handleClick = useCallback(
      (action: "update" | "delete") => {
        switch (action) {
          case "update":
            router.push({
              pathname: "/add-post",
              params: {
                post: JSON.stringify(post),
              },
            });
            break;
          case "delete":
            setIsVisible(true);
            break;
          default:
            break;
        }
      },
      [post]
    );

    // delete post
    const handleDeletePost = useCallback(async () => {
      await deletePost(post?.id as string);
      setIsVisible(false);
    }, [deletePost, post?.id]);

    // handle Like
    const handleLike = useCallback(async () => {
      startTransition(() => {
        if (post.is_liked) {
          post.is_liked = false;
          post.likes_count = (post.likes_count || 1) - 1;
        } else {
          post.is_liked = true;
          post.likes_count = (post.likes_count || 0) + 1;
        }
        likePost(post?.id as string);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post.is_liked, post.likes_count, post.id, likePost]);

    // handle share
    const handleShare = useCallback(async () => {
      try {
        let message = "";

        if (post.content) {
          message += `📝 ${post.content}\n\n`;
        }

        if (post.file) {
          message += `📎 Check this out: ${post.file}\n\n`;
        }

        message += "🔗 Shared via link-up — discover more posts!";

        await Share.share(
          {
            message,
            url: Platform.OS === "ios" && post.file ? post.file : undefined,
          },
          {
            dialogTitle: "Share this post",
          }
        );
      } catch (error: any) {
        Alert.alert("Error sharing post", error.message || "");
      }
    }, [post.content, post.file]);

    const shouldAnimate = index < 10;
    const animationDelay = shouldAnimate ? index * 50 : 0;

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
              params: { id: String(post?.id ?? "") },
            })
          }
        >
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
                  {post.user?.name + " "}
                  <Text style={styles.userHandle}>
                    •
                    <MaterialCommunityIcons
                      size={15}
                      name="map-marker-outline"
                    />
                    {post.location ?? "N/A"}
                  </Text>
                </Text>
                <Text style={styles.userHandle}>{formattedDate}</Text>
              </View>
            </View>
            <View style={styles.categoryBadge}>
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: categorie?.color,
                  },
                ]}
              >
                {categorie?.name}
              </Text>
            </View>
            {/* menu */}
            {post?.user?.id === userId && showAction && (
              <ContextMenu
                onUpdate={() => handleClick("update")}
                onDelete={() => handleClick("delete")}
                menuWidth={120}
              />
            )}
          </View>
          <PostContent content={post.content!} />

          {post.file && (
            <Image
              transition={100}
              contentFit="cover"
              source={{ uri: post.file }}
              style={styles.postImage}
            />
          )}

          {showAction && (
            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLike}
                disabled={isPending}
              >
                <Ionicons
                  name={post.is_liked ? "heart" : "heart-outline"}
                  size={20}
                  color={post.is_liked ? "#ef4444" : THEME.colors.grey2}
                />
                <Text
                  style={[
                    styles.actionText,
                    post.is_liked && { color: "#ef4444" },
                  ]}
                >
                  {post.likes_count}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons
                  name="chatbubble-outline"
                  size={20}
                  color={THEME.colors.grey2}
                />
                <Text style={styles.actionText}>0</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                style={styles.actionButton}
              >
                <Ionicons
                  name="share-outline"
                  size={20}
                  color={THEME.colors.grey2}
                />
              </TouchableOpacity>
            </View>
          )}
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
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    // elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  userHandle: {
    fontSize: 14,
    color: THEME.colors.grey2,
    marginTop: 2,
  },
  categoryBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 5,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
  },

  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  menu: {
    paddingHorizontal: 5,
  },
});
