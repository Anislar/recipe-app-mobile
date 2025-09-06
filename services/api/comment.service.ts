import { ApiQueryParams, ApiSuccess } from "@/type";
import { api } from "../axios-instance";
import { handleApiError } from "@/helpers/utils";

class CommentService {
  private prefix: string;
  constructor() {
    this.prefix = "post/comment";
  }

  async getComments(
    data: ApiQueryParams & {
      postId: string;
    }
  ): Promise<ApiSuccess<any>> {
    try {
      const response = await api.get(this.prefix + "/", {
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
  async addComment(postId: string, content: string): Promise<ApiSuccess<any>> {
    try {
      const response = await api.get(this.prefix + "/me");
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  async updateComment(
    commentId: string,
    content: string
  ): Promise<ApiSuccess<any>> {
    try {
      const response = await api.get(this.prefix + "/me");
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
  async deleteComment(commentId: string): Promise<ApiSuccess<any>> {
    try {
      const response = await api.get(this.prefix + "/me");
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}

const commentService = new CommentService();
export { commentService };
