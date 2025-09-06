export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  createdAt: string;
  updatedAt: string;
  isEdited?: boolean;
  isLiked?: boolean;
  _count: {
    likes: number;
    replies: number;
  };
  replies?: Comment[];
  parentId?: string | null;
}
export interface CommentFilters {
  page?: number;
  limit?: number;
  sortBy?: "newest" | "oldest" | "popular";
  authorId?: string;
}
