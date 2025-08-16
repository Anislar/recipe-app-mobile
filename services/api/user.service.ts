import { ApiSuccess } from "@/type";
import { api } from "../axios-instance";
import { handleApiError } from "@/helpers/utils";
import { UpdateUserType } from "@/helpers/user";

class UserService {
  private prefix: string;
  constructor() {
    this.prefix = "user";
  }

  async getCurrentUser(): Promise<ApiSuccess<any>> {
    try {
      console.log(this.prefix + "/me");

      const response = await api.get(this.prefix + "/me");
      return response.data;
    } catch (error) {
      console.log("🚀 ~ UserService ~ getCurrentUser ~ error:", error);
      return handleApiError(error);
    }
  }
  async updateUser(data: UpdateUserType): Promise<ApiSuccess<any>> {
    try {
      const response = await api.put(this.prefix + "/", { data });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}

const userService = new UserService();
export { userService };
