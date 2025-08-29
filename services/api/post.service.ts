import { ApiQueryParams, ApiSuccess } from "@/type";
import { api } from "../axios-instance";
import { handleApiError } from "@/helpers/utils";
import { PostType } from "@/helpers/post";

class PostService {
  private prefix: string;
  constructor() {
    this.prefix = "/post";
  }
  async addPost(data: PostType): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(this.prefix + "/", data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
  async fetchPost(data: ApiQueryParams): Promise<ApiSuccess<any>> {
    try {
      const response = await api.get(this.prefix + "/", {
        params: {
          page: data.page ?? 1,
          limit: data.limit ?? 15,
          sortOrder: data.sortOrder ?? "desc",
          ...(data.filters || {}),
        },

        signal: data.signal,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
  async deletePost(id: string) {
    try {
      const response = await api.delete(this.prefix + "/" + id);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
  async updatePost(id: string, data: PostType) {
    try {
      const response = await api.put(this.prefix + "/" + id, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
  async setLike(id: string, data: Record<string, string>) {
    try {
      console.log(
        `🚀 ~ usePostMutations ~ id, {
        target_type: "POST",
      }:`,
        id,
        {
          target_type: "POST",
        }
      );
      const response = await api.patch(this.prefix + "/like/" + id, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}

const postService = new PostService();
export { postService };
