import { ApiError, ApiSuccess } from "@/type";
import { api } from "../axios-instance";
import { OAuthCallbackData } from "./oauth.service";
import {
  SendCodeType,
  ResetPasswordType,
  SignInType,
  SignUpType,
  VerifyCodeType,
} from "@/helpers/schema";

class AuthService {
  private prefix: string;
  constructor() {
    this.prefix = "/auth";
  }

  private handleApiError(error: any): never {
    if (error.response?.data) {
      const apiError: ApiError = error.response.data;
      throw apiError;
    }
    throw error;
  }

  async login(data: SignInType): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(this.prefix + "/signin", data);
      return response.data;
    } catch (error: any) {
      this.handleApiError(error);
    }
  }

  async signup(data: SignUpType): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(this.prefix + "/signup", data);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async verifyCode(data: VerifyCodeType): Promise<ApiSuccess<any>> {
    try {
      let url = "/verify-code-password";
      if (data.path === "verify-email") {
        url = "/verify-email";
      }
      const response = await api.post(this.prefix + url, {
        email: data.email,
        code: data.code.join(""),
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }
  async sendCode(data: SendCodeType): Promise<ApiSuccess<any>> {
    try {
      let url = "/password/forgot";
      if (data.path === "verify-email") {
        url = "/code-verify-email";
      }
      const response = await api.post(this.prefix + url, { email: data.email });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }
  async resetPassword(data: ResetPasswordType): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(this.prefix + "/reset-password", data);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }
  async getCurrentUser(): Promise<ApiSuccess<any>> {
    try {
      const response = await api.get("/user" + "/me");
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }
  async logout(): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(this.prefix + "/logout");
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
      this.handleApiError(error);
    }
  }
}

const authService = new AuthService();
export { authService };
