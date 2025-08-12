import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { ScreenWrapper } from "@/components";
import { useAuthStore } from "@/store";
import { usePostStore } from "@/store/post.store";
import { useTranslation } from "react-i18next";
import {
  PostHeader,
  CategoryTag,
  FileAttachment,
  ActionBar,
  RichTextContent,
} from "@/components/post/detail";
import { Post } from "@/helpers/post";
import { Ionicons } from "@expo/vector-icons";
import { hp, wp } from "@/helpers/common";

const PostDetails: React.FC = () => {
  const { t } = useTranslation();
  const post = usePostStore((s) => s.post) as Post | null;
  const user = useAuthStore((state) => state.user);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(post?.likes_count || 0);
  const isEmptyPost =
    !post || (!post.category && !post.content && !post.file && !post.location);
  if (isEmptyPost) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-outline" size={64} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>{t("post.notFound")}</Text>
        <Text style={styles.emptyMessage}>{t("post.notFoundMessage")}</Text>
      </View>
    );
  }
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    //onLike?.(post.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    //onSave?.(post.id);
  };

  const handleShare = () => {
    //onShare?.(post.id);
  };

  const handleComment = () => {
    // onComment?.(post.id);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenWrapper bg="white">
        <PostHeader
          name={user?.name!}
          avatar={user?.avatar!}
          createdAt={post?.createdAt}
          location={post?.location}
        />

        <CategoryTag category={(post?.category as any)?.value || undefined} />

        <View style={styles.section}>
          <RichTextContent html={post?.content!} />
        </View>

        <FileAttachment file={post?.file} />

        <ActionBar
          likes={likesCount}
          liked={isLiked}
          saved={isSaved}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onSave={handleSave}
        />
      </ScreenWrapper>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  section: {
    paddingHorizontal: wp(5),
    marginBottom: hp(1.5),
  },

  // empty post
  emptyContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default PostDetails;
