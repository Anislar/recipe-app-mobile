import { PostCard, ScreenWrapper } from "@/components";
import { CommentsSection } from "@/components/post/comment/list";
import { Post } from "@/helpers/post";
import { useLocalSearchParams } from "expo-router/build/hooks";

const DetailPost = () => {
  const { post } = useLocalSearchParams<{ post?: string }>();
  const parsePost: Post & { user: any } = post ? JSON.parse(post) : null;

  return (
    <ScreenWrapper bg="white">
      <PostCard post={parsePost} index={0} />
      <CommentsSection postId={parsePost?.id} />
    </ScreenWrapper>
  );
};

export default DetailPost;
