import { LoginCredentials, RegisterData } from "@/type";
import { api } from "../axios-instance";

interface OAuthCallbackData {
  code: string;
  redirectUri: string;
}

class AuthService {
  private prefix: string;
  constructor() {
    this.prefix = "/auth";
  }
  async login(data: LoginCredentials) {
    try {
      const response = await api.post(this.prefix + "/signin", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async register(data: RegisterData) {
    try {
      const response = await api.post(this.prefix + "/signup", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async oauthCallback(
    provider: "google" | "github" | "discord",
    data: OAuthCallbackData
  ) {
    try {
      const response = await api.post(
        `${this.prefix}/${provider}/callback`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
const authService = new AuthService();
export { authService };
