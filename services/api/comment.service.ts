import { ApiQueryParams, ApiSuccess } from "@/type";
import { api } from "../axios-instance";
import { handleApiError } from "@/helpers/utils";
import { CommentType } from "@/schema/comment";

class CommentService {
  private prefix: string;
  constructor() {
    this.prefix = "post";
  }

  async getComments(
    data: ApiQueryParams & {
      postId: string;
    }
  ): Promise<ApiSuccess<any>> {
    try {
      const response = await api.get(`${this.prefix}/${data.postId}/comments`, {
        params: {
          page: data.page ?? 1,
          limit: data.limit ?? 15,
          sortOrder: data.sortOrder ?? "desc",
        },

        signal: data.signal,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
  async getReplies(
    data: ApiQueryParams & {
      commentId: string;
    }
  ): Promise<ApiSuccess<any>> {
    try {
      const response = await api.get(
        `${this.prefix}/comment/${data.commentId}/replies`,
        {
          params: {
            page: data.page ?? 1,
            limit: data.limit ?? 15,
            sortOrder: data.sortOrder ?? "desc",
          },

          signal: data.signal,
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  async addComment(
    postId: string,
    data: CommentType
  ): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(`${this.prefix}/${postId}/comment`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  async updateComment(
    commentId: string,
    data: CommentType
  ): Promise<ApiSuccess<any>> {
    try {
      const response = await api.put(
        `${this.prefix}/comment/${commentId}`,
        data
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
  async deleteComment(commentId: string): Promise<ApiSuccess<any>> {
    try {
      const response = await api.delete(`${this.prefix}/comment/${commentId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
  async setLike(id: string, data: Record<string, string>) {
    try {
      const response = await api.patch(this.prefix + "/like/" + id, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}

const commentService = new CommentService();
export { commentService };
