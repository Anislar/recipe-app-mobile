import { ApiQueryParams, ApiSuccess } from "@/type";
import { api } from "../axios-instance";
import { handleApiError } from "@/helpers/utils";
import { AddPostType } from "@/helpers/post";

class PostService {
  private prefix: string;
  constructor() {
    this.prefix = "/post";
  }

  async addPost(data: AddPostType): Promise<ApiSuccess<any>> {
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
}

const postService = new PostService();
export { postService };
