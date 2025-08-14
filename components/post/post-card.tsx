import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Post } from "@/helpers/post";
import { useAuthStore } from "@/store";
import { categories } from "@/helpers/post/utils";
import { THEME } from "@/constants/theme";

interface PostCardProps {
  post: Post;
}
export const PostCard = ({ post }: PostCardProps) => {
  const user = useAuthStore((state) => state.user);
  const handleLike = (postId: string) => {};
  const categorie = categories.find((cat) => cat.id === post.category);
  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: user?.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userHandle}>
              {user?.role} • {post.createdAt}
            </Text>
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
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      {post.file && (
        <Image source={{ uri: post.file }} style={styles.postImage} />
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
          {/* <Text style={styles.actionText}>{post.comments}</Text> */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color={THEME.colors.grey2} />
        </TouchableOpacity>
      </View>
    </View>
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
    color: "#6b7280",
    marginTop: 2,
  },
  categoryBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
    marginBottom: 12,
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
});
