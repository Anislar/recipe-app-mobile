import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import { lazy, memo, Suspense, useCallback, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { User } from "@/helpers/auth";
import { wp } from "@/helpers/common";
import { Post } from "@/helpers/post";
import { showToast } from "@/helpers/toastService";
import { usePostMutations } from "@/hooks/post/useMutationPost";

import { LoadingSpinner } from "../UI/loading";
import { PostAction, PostContent, PostHeader, PostMedia } from "./card";

const ModalConfirm = lazy(() =>
  import("../UI/modal-confirm").then((mod) => ({ default: mod.ModalConfirm }))
);

interface PostCardProps {
  post: Partial<Post> & { user: Partial<User> };
  index: number;
  showAction?: boolean;
  enableNavigation?: boolean;
}

export const PostCard = memo(
  ({ post, showAction = true, index, enableNavigation }: PostCardProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const {
      remove: { mutateAsync: deletePost, isPending: isLoading, error, isError },
    } = usePostMutations();

    /** handleDeletePost */
    const handleDeletePost = useCallback(async () => {
      await deletePost(post.id!);
      setIsVisible(false);
    }, [deletePost, post.id]);

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

    const Wrapper = enableNavigation ? Pressable : View;
    return (
      <Animated.View
        entering={
          shouldAnimate
            ? FadeInDown.delay(animationDelay).duration(300)
            : undefined
        }
        style={styles.postCard}
      >
        <Wrapper
          {...(enableNavigation && {
            onPress: () =>
              router.push({
                pathname: "/(modal)/detail-post",
                params: { post: JSON.stringify(post) },
              }),
          })}
        >
          {/* Header */}
          <PostHeader
            post={post as any}
            showAction={showAction}
            handleAction={handleAction}
          />

          {/* Content */}
          <PostContent content={post.content!} />
          {/* Media */}
          <PostMedia file={post.file} handleAction={handleAction} />
          {/* Footer Actions */}
          {showAction && (
            <PostAction post={post as any} handleShare={handleShare} />
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
        </Wrapper>
      </Animated.View>
    );
  }
);

PostCard.displayName = "PostCard";

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: "#ffffff",
    marginBottom: 1,
    paddingHorizontal: wp(3.5),
    paddingVertical: 16,
  },
});
