import { ApiSuccess } from "@/type";
import { api } from "../axios-instance";
import { OAuthCallbackData } from "./oauth.service";
import {
  SendCodeType,
  ResetPasswordType,
  SignInType,
  SignUpType,
  VerifyCodeType,
} from "@/helpers/auth";
import { handleApiError } from "@/helpers/utils";

class AuthService {
  private prefix: string;
  constructor() {
    this.prefix = "/auth";
  }

  async signIn(data: SignInType): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(this.prefix + "/signin", data);
      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async signUp(data: SignUpType): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(this.prefix + "/signup", data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
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
      return handleApiError(error);
    }
  }
  async sendCode(data: SendCodeType): Promise<ApiSuccess<any>> {
    try {
      let url = "/forgot-password";
      if (data.path === "verify-email") {
        url = "/code-verify-email";
      }
      const response = await api.post(this.prefix + url, { email: data.email });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
  async resetPassword(data: ResetPasswordType): Promise<ApiSuccess<any>> {
    try {
      let url = "/reset-password";
      if (data.currentPassword) {
        url = "/change-password";
      }
      const response = await api.post(this.prefix + url, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
  async logout(): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(this.prefix + "/logout");
      return response.data;
    } catch (error) {
      return handleApiError(error);
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
      return handleApiError(error);
    }
  }
}

const authService = new AuthService();
export { authService };
