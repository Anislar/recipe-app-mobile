import { LoginCredentials, RegisterData } from "@/type";
import { api } from "../axios-instance";
import { OAuthCallbackData } from "./oauth.service";

interface ApiError {
  success: false;
  message: string;
  code: string;
  errors?: {
    field: string;
    message: string;
    code: string;
  }[];
  timestamp: string;
}

interface ApiSuccess<T> {
  success: true;
  message: string;
  data?: T;
  token?: string;
  timestamp: string;
}

class AuthService {
  private prefix: string;
  constructor() {
    this.prefix = "/auth";
  }

  private handleApiError(error: any): never {
    if (error.response?.data) {
      const apiError: ApiError = error.response.data;
      const customError = new Error(apiError.message);
      (customError as any).code = apiError.code;
      (customError as any).errors = apiError.errors;
      throw customError;
    }
    throw error;
  }

  async login(data: LoginCredentials): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(this.prefix + "/signin", data);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async register(data: RegisterData): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(this.prefix + "/signup", data);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async oauthCallback(
    provider: "google" | "github" | "discord",
    data: OAuthCallbackData
  ): Promise<ApiSuccess<any>> {
    try {
      let url = `${this.prefix}/${provider}/callback?code=${data.code}`;
      if (data.codeVerifier) {
        url += `&code_verifier=${data.codeVerifier}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.log("🚀 ~ AuthService ~ error:", error);
      this.handleApiError(error);
    }
  }
}

const authService = new AuthService();
export { authService };
