import { THEME } from "@/constants/theme";
import { User } from "@/helpers/auth";
import { hp } from "@/helpers/common";
import { Post } from "@/helpers/post";
import { categories } from "@/helpers/post/utils";
import { formatDate } from "@/helpers/utils";
import { useAuthStore } from "@/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "../avatar";
import ContextMenu from "../UI/context-menu";
import { PostContent } from "./post-content";

interface PostCardProps {
  post: Partial<Post> & {
    user: Partial<User>;
  };
}
export const PostCard = ({ post }: PostCardProps) => {
  const userId = useAuthStore((s) => s.user?.id);
  const handleLike = (postId: string | undefined) => {};
  const categorie = categories.find((cat) => cat.id === post.category);
  return (
    <Pressable style={styles.postCard}>
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
                •<MaterialCommunityIcons size={15} name="map-marker-outline" />
                {post.location ?? "N/A"}
              </Text>
            </Text>
            <Text style={styles.userHandle}>{formatDate(post.createdAt)}</Text>
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
        {post?.user?.id === userId && <ContextMenu menuWidth={120} />}
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

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(post.id)}
        >
          <Ionicons
            name={post.liked ? "heart" : "heart-outline"}
            size={20}
            color={post.liked ? "#ef4444" : THEME.colors.grey2}
          />
          <Text style={[styles.actionText, post.liked && { color: "#ef4444" }]}>
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

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color={THEME.colors.grey2} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  postCard: {
    backgroundColor: "#ffffff",
    marginBottom: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
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
