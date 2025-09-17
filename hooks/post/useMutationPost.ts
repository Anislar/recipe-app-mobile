import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/api/post.service";
import { PostType } from "@/schema/post";
import { useAuthStore } from "@/store";
import { LikeTargetType } from "@/type";

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
              name: user?.name,
              avatar: user?.avatar!,
            },
          };

      queryClient.setQueryData(["posts", "general"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any, index: number) => {
            if (variables.id) {
              return {
                ...page,
                data: {
                  ...page.data,
                  results: page.data?.results.map((p: any) =>
                    p.id === variables.id ? { ...p, ...newPost } : p
                  ),
                },
              };
            }
            if (index === 0) {
              return {
                ...page,
                data: {
                  ...page.data,
                  results: [newPost, ...(page.data?.results || [])],
                },
              };
            }

            return page;
          }),
        };
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
      queryClient.setQueryData(["posts", "general"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              results: page.data?.results.filter((p: any) => p.id !== id),
            },
          })),
        };
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

      queryClient.setQueryData(["posts", "general"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => {
            return {
              ...page,
              data: {
                ...page.data,
                results: page.data?.results.map((p: any) =>
                  p.id === res.data.id
                    ? {
                        ...p,
                        is_liked: res.data.is_liked,
                        likes_count: res.data.likes_count,
                      }
                    : p
                ),
              },
            };
          }),
        };
      });
    },
    onError: (err) => {
      return err?.message || "SET_LIKE_FAILED";
    },
  });
  return { save, remove, setLike };
}
