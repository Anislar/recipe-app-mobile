export interface NotificationType {
  success: boolean;
  message: string;
  data: Data;
  timestamp: Date;
}

export interface Data {
  results: Notification[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  totalPages: number;
  totalItems: string;
}

export interface Notification {
  id: number;
  type: Type;
  targetId: number;
  targetType: TargetType;
  userId: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  actor: Actor;
  post: Post | null;
  comment: Post | null;
}

export interface Actor {
  id: number;
  name: string;
  avatar: string | null;
}

export interface Post {
  id: number;
  content: string;
}

export enum TargetType {
  Post = "post",
  Comment = "comment",
}

export enum Type {
  Comment = "comment",
  Like = "like",
}
