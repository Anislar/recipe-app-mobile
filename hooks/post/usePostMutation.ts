import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/api/post.service";
import { Post, PostType } from "@/schema/post";
import { useAuthStore } from "@/store";
import { LikeTargetType } from "@/type";
import { patchQuery } from "@/helpers/patchQuery";

export function usePostMutations() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const save = useMutation({
    mutationFn: async (payload: { id?: string; data: PostType }) => {
      if (payload.id) {
        return await postService.updatePost(payload.id, payload.data);
      }
      return await postService.addPost(payload.data);
    },
    onSuccess: (res, variables) => {
      if (!res.success) return;
      const newPost = variables.id
        ? res.data
        : {
            ...res.data,
            user: {
              id: user?.id,
              name: user?.name,
              avatar: user?.avatar!,
            },
          };
      patchQuery<Post>({
        queryClient,
        key: ["posts", "general"],
        type: variables.id ? "update" : "add",
        newItem: newPost,
        matchId: variables.id!,
      });
    },
    onError: (err) => {
      return err?.message || "POST_SAVE_FAILED";
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => await postService.deletePost(id),
    onSuccess: (res, id) => {
      if (!res?.success) return;
      patchQuery<Post>({
        queryClient,
        key: ["posts", "general"],
        type: "delete",
        matchId: id!,
      });
    },
  });

  const setLike = useMutation({
    mutationFn: async (id: string) =>
      await postService.setLike(id, {
        target_type: LikeTargetType.POST,
      }),

    onSuccess: (res) => {
      if (!res.success) return;

      patchQuery<Post>({
        queryClient,
        key: ["posts", "general"],
        type: "update",
        newItem: res.data,
        matchId: res.data.id,
      });
    },
    onError: (err) => {
      return err?.message || "SET_LIKE_FAILED";
    },
  });
  return { save, remove, setLike };
}
