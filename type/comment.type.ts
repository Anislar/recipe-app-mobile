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
  replies_count: number;
  replies?: Comment[];
  parent_id: string | null;
}

export type ActionType = "edit" | "reply";

export interface ActiveAction {
  id: string;
  type: ActionType;
  content: string;
}
export interface CommentFilters {
  page?: number;
  limit?: number;
  sortBy?: "newest" | "oldest" | "popular";
}
