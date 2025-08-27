import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/api/post.service";
import { AddPostType } from "@/helpers/post";
import { useAuthStore } from "@/store";

export function usePostMutations() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const create = useMutation({
    mutationFn: async (data: AddPostType) => await postService.addPost(data),
    onSuccess: (res) => {
      if (!res.success) return;
      const responseDate = {
        ...res.data,
        user: {
          name: user?.name,
          avatar: user?.avatar!,
        },
      };
      queryClient.setQueryData(["posts", "general"], (old: any) => {
        if (!old) {
          return {
            pageParams: [1],
            pages: [
              {
                data: {
                  results: [responseDate],
                },
              },
            ],
          };
        }

        const pages = Array.isArray(old.pages) ? old.pages : [];

        return {
          ...old,
          pages: pages.map((page: any, i: number) =>
            i === 0
              ? {
                  ...page,
                  data: {
                    ...page.data,
                    results: [responseDate, ...(page.data?.results || [])],
                  },
                }
              : page
          ),
        };
      });
    },

    onError: (res) => {
      console.log("🚀 ~ usePostMutations ~ res error:", res);
      return res?.message || "POST_ADD_FAILED";
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      postService.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => postService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { create, update, remove };
}
