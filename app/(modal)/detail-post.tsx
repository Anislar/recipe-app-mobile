import { PostCard, ScreenWrapper } from "@/components";
import { CommentSection } from "@/components/post/comment/list";
import { ExpandableCard } from "@/components/UI/expandable-card";
import { Post } from "@/schema/post";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router/build/hooks";

interface IData extends Post {
  user: any;
}
const DetailPost = () => {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData<any>(["posts", "general"]);

  const initialPost: IData = (
    cachedData?.pages?.flatMap((page: any) => page.data.results) || []
  )?.find((p: IData) => String(p.id) === postId);

  const { data: post } = useQuery({
    queryKey: ["posts", "general", postId],
    queryFn: () => Promise.resolve(initialPost),
    initialData: initialPost,
    enabled: !!initialPost,
  });

  return (
    <ScreenWrapper pt={0} bg="white">
      <ExpandableCard
        TopView={<PostCard post={post as IData} index={0} />}
        BottomView={({ expanded, toggleExpand }) => (
          <CommentSection
            expanded={expanded}
            toggleExpand={toggleExpand}
            postId={postId}
          />
        )}
      />
    </ScreenWrapper>
  );
};

export default DetailPost;
