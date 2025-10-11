import { ApiQueryParams, ApiSuccess, SearchResult } from "@/type";
import { api } from "../axios-instance";
import { handleApiError } from "@/helpers/utils";
import { PostType } from "@/schema/post";

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
          filter: data.filter,
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
      const response = await api.patch(this.prefix + "/like/" + id, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
  async search(
    data: Record<string, string>,
    signal: AbortSignal
  ): Promise<ApiSuccess<SearchResult>> {
    try {
      let url = this.prefix + "/search";
      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value).trim());
        }
      });

      if ([...params].length > 0) {
        url += "?" + params.toString();
      }

      const response = await api.get(url, { signal });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}

const postService = new PostService();
export { postService };
