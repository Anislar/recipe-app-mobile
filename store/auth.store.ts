import { create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import { getItem, setItem, deleteItemAsync } from "expo-secure-store";

import { authService, oauthService } from "@/services";
import {
  SendCodeType,
  ResetPasswordType,
  SignInType,
  SignUpType,
  User,
  VerifyCodeType,
} from "@/schema/auth";
import { ApiError } from "@/type";
import { userService } from "@/services/api/user.service";
import { UpdateUserType } from "@/schema/user";

export interface AuthState {
  isLoading: boolean;
  error: {
    message: string;
    code: string;
  } | null;
  // User data
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setLoading: (isLoading: boolean) => void;
  setError: (error: AuthState["error"] | null) => void;
  // User data
  setUser: (user: AuthState["user"]) => void;
  setToken: (data: { accessToken: string; refreshToken: string }) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setResetElement: () => void;
  //signIn
  signIn: (data: SignInType) => Promise<boolean | string>;
  //signUp
  signUp: (data: SignUpType) => Promise<boolean | string>;
  //reset password
  resetPassword: (data: ResetPasswordType) => Promise<boolean | string>;
  // verifyCode (verify email, forgotPassword)
  verifyCode: (data: VerifyCodeType) => Promise<boolean | string>;
  // sendCode (verify email, forgotPassword)
  sendCode: (data: SendCodeType) => Promise<boolean | string>;
  // me
  getCurrentUser: () => Promise<boolean | string>;
  // update profile
  updateProfile: (data: UpdateUserType) => Promise<boolean | string>;

  // Logout
  logout: () => Promise<boolean | string>;

  // OAuth
  loginWithGoogle: (
    code: string,
    codeVerifier: string
  ) => Promise<boolean | string>;
  loginWithGithub: (
    code: string,
    codeVerifier: string
  ) => Promise<boolean | string>;
  loginWithDiscord: (
    code: string,
    codeVerifier: string
  ) => Promise<boolean | string>;
}

type AuthPersist = Pick<AuthState, "token" | "user" | "isAuthenticated">;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isLoading: false,
      error: null,
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      // Basic actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setUser: (user) => set({ user }),
      setToken: (data) =>
        set({ token: data.accessToken, refreshToken: data.refreshToken }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setResetElement: () =>
        set({
          error: null,
          isLoading: false,
        }),
      // Login action
      signIn: async (data: SignInType) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const response = await authService.signIn(data);
          const { data: userData, tokenData } = response;
          set({
            user: userData,
            isLoading: false,
            error: null,
            token: tokenData?.accessToken,
            refreshToken: tokenData?.refreshToken,
            isAuthenticated: true,
          });
          return true;
        } catch (error: ApiError | any) {
          set({
            isLoading: false,
            error: {
              message: error.message,
              code: error.code || "LOGIN_FAILED",
            },
          });
          return error.code || "LOGIN_FAILED";
        }
      },

      // Register action
      signUp: async (data: SignUpType) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          // TODO: Replace with your actual API call
          await authService.signUp(data);

          set({
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error: ApiError | any) {
          set({
            isLoading: false,
            error: {
              message: error.message,
              code: error.code || "REGISTRATION_FAILED",
            },
          });
          return error.code || "REGISTRATION_FAILED";
        }
      },

      sendCode: async (data: SendCodeType) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          await authService.sendCode(data);
          set({
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error: ApiError | any) {
          set({
            isLoading: false,
            error: {
              message:
                error instanceof Error ? error.message : "Resend Code failed",
              code: error.code || "RESEND_CODE_FAILED",
            },
          });
          return error.code || "RESEND_CODE_FAILED";
        }
      },

      // Verify Code
      verifyCode: async (data: VerifyCodeType) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const response = await authService.verifyCode(data);
          if (data.path === "verify-email") {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
            });
          }
          set({
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error: ApiError | any) {
          set({
            isLoading: false,
            error: {
              message: error.message,
              code: error.code || "VERIFY_CODE_FAILED",
            },
          });
          return error.code || "VERIFY_CODE_FAILED";
        }
      },
      // Reset password
      resetPassword: async (data: ResetPasswordType) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          await authService.resetPassword(data);
          set({
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error: ApiError | any) {
          set({
            isLoading: false,
            error: {
              message: error.message,
              code: error.code || "RESET_PASSWORD_FAILED",
            },
          });
          return error.code || "RESET_PASSWORD_FAILED";
        }
      },
      // me
      getCurrentUser: async () => {
        set({
          isLoading: true,
        });

        try {
          const response = await userService.getCurrentUser();
          const { data: user } = response;

          set({
            isLoading: false,
            error: null,
            isAuthenticated: true,
            user,
          });
          return true;
        } catch (error: ApiError | any) {
          set({
            isLoading: false,
            error: {
              message: error.message,
              code: error.code || "GET_CURRENT_USER",
            },
          });
          return error.code || "GET_CURRENT_USER";
        }
      },
      updateProfile: async (data: UpdateUserType) => {
        set({
          isLoading: true,
        });

        try {
          const response = await userService.updateUser(data);
          const { data: user } = response;

          set({
            isLoading: false,
            error: null,
            user,
          });
          return true;
        } catch (error: ApiError | any) {
          set({
            isLoading: false,
            error: {
              message: error.message,
              code: error.code || "UPDATE_USER",
            },
          });
          return error.code || "UPDATE_USER";
        }
      },
      // Logout
      logout: async () => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          authService.logout();
          set({
            user: null,
            error: null,
            isLoading: false,
            isAuthenticated: false,
          });
          return true;
        } catch (error: ApiError | any) {
          set({
            isLoading: false,
            error: {
              message: error.message,
              code: error.code || "LOGOUT_FAILED",
            },
            token: null,
          });
          return error.code || "LOGOUT_FAILED";
        }
      },

      // OAuth actions
      loginWithGoogle: async (code: string, codeVerifier: string) => {
        set({
          error: null,
        });

        try {
          const result = await oauthService.handleOAuthCallback("google", {
            code,
            codeVerifier,
          });
          set({
            isAuthenticated: true,
            user: result.data,
            token: result.tokenData.accessToken,
            refreshToken: result.tokenData.refreshToken,
          });
          return true;
        } catch (error: ApiError | any) {
          set({
            error: {
              message: error.message,
              code: error.code || "GOOGLE_LOGIN_FAILED",
            },
          });
          return error.code || "GOOGLE_LOGIN_FAILED";
        }
      },

      loginWithGithub: async (code: string, codeVerifier: string) => {
        set({
          error: null,
        });

        try {
          const result = await oauthService.handleOAuthCallback("github", {
            code,
            codeVerifier,
          });
          set({
            isAuthenticated: true,
            user: result.data,
            token: result.tokenData.accessToken,
            refreshToken: result.tokenData.refreshToken,
          });
          return true;
        } catch (error: ApiError | any) {
          set({
            error: {
              message: error.message,
              code: error.code || "GITHUB_LOGIN_FAILED",
            },
          });
          return error.code || "GITHUB_LOGIN_FAILED";
        }
      },

      loginWithDiscord: async (code: string, codeVerifier: string) => {
        set({
          error: null,
        });
        try {
          const result = await oauthService.handleOAuthCallback("discord", {
            code,
            codeVerifier,
          });
          set({
            isLoading: false,
            isAuthenticated: true,
            user: result.data,
            token: result.tokenData.accessToken,
            refreshToken: result.tokenData.refreshToken,
          });
          return true;
        } catch (error: ApiError | any) {
          set({
            isLoading: false,
            error: {
              message: error.message,
              code: error.code || "DISCORD_LOGIN_FAILED",
            },
          });
          return error.code || "DISCORD_LOGIN_FAILED";
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => ({
        setItem,
        getItem,
        removeItem: deleteItemAsync,
      })),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    } as PersistOptions<AuthState, AuthPersist>
  )
);
