export interface Comment {
  id: string;
  content: string;
  postId: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  createdAt: string;
  updatedAt: string;
  is_edited?: boolean;
  is_liked?: boolean;
  likes_count: number;
  replies?: Comment[];
  parentId?: string | null;
}
export interface CommentFilters {
  page?: number;
  limit?: number;
  sortBy?: "newest" | "oldest" | "popular";
}
