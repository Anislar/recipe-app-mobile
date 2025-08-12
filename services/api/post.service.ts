import { ApiSuccess } from "@/type";
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
      const response = await api.post(this.prefix + "/", { data });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}

const postService = new PostService();
export { postService };
