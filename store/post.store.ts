import { create } from "zustand";

import { ApiError } from "@/type";
import { AddPostType, Post } from "@/helpers/post";
import { postService } from "@/services/api/post.service";

export interface PostStore {
  isLoading: boolean;
  error: {
    message: string;
    code: string;
  } | null;
  // post data
  post: Post | null;
  posts: Post[];

  setLoading: (isLoading: boolean) => void;
  setError: (error: PostStore["error"] | null) => void;
  // post data
  setPost: (user: PostStore["post"]) => void;
  setPosts: (posts: Post[], replace?: boolean) => void;
  addPosts: (post: Post) => void;
  clearPosts: () => void;
  setResetElement: () => void;
  addPost: (data: AddPostType) => Promise<boolean | string>;
}

export const usePostStore = create<PostStore>((set) => ({
  // Initial state
  isLoading: false,
  error: null,
  post: null,
  posts: [],
  // Basic actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setPost: (post) => set({ post }),
  setPosts: (posts: Post[], replace: boolean = true) =>
    set((state) => ({
      posts: replace ? posts : [...state.posts, ...posts],
    })),
  addPosts: (post: Post) => set((state) => ({ posts: [...state.posts, post] })),
  clearPosts: () => set({ posts: [] }),
  setResetElement: () =>
    set({
      error: null,
      isLoading: false,
    }),
  addPost: async (data: AddPostType) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await postService.addPost(data);
      set((state) => ({
        posts: [response.data.data, ...state.posts],
        post: response.data.data,
        isLoading: false,
        error: null,
      }));
      return true;
    } catch (error: ApiError | any) {
      set({
        isLoading: false,
        error: {
          message: error.message,
          code: error.code || "POST_ADD_FAILED",
        },
      });
      return error.code || "POST_ADD_FAILED";
    }
  },
}));
