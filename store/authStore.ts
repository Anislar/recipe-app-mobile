import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getItem, setItem, deleteItemAsync } from "expo-secure-store";

import { authService, oauthService } from "@/services";
import {
  FogotPasswordType,
  ResetPasswordType,
  SignInType,
  SignUpType,
  User,
  VerifyCodeType,
} from "@/helpers/schema";
export interface AuthState {
  isLoading: boolean;
  error: {
    message: string;
    code: string;
  } | null;
  // User data
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  setLoading: (isLoading: boolean) => void;
  setError: (error: AuthState["error"] | null) => void;
  // User data
  setUser: (user: AuthState["user"]) => void;
  setToken: (token: AuthState["token"]) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;

  login: (data: SignInType) => Promise<void>;
  register: (data: SignUpType) => Promise<void>;
  forgotPassword: (data: FogotPasswordType) => Promise<boolean>;
  resetPassword: (data: ResetPasswordType) => Promise<boolean>;
  verifyCode: (data: VerifyCodeType) => Promise<boolean>;

  // Logout
  logout: () => void;

  // OAuth
  loginWithGoogle: (code: string, codeVerifier: string) => Promise<void>;
  loginWithGithub: (code: string, codeVerifier: string) => Promise<void>;
  loginWithDiscord: (code: string, codeVerifier: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isLoading: false,
      error: null,
      user: null,
      token: null,
      isAuthenticated: false,
      isSuccess: false,
      // Basic actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      // Login action
      login: async (data: SignInType) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          const response = await authService.login(data);
          const { data: userData, token } = response;
          set({
            user: userData,
            isLoading: false,
            error: null,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.log("🚀 ~ login: ~ error:", error);
          set({
            isLoading: false,
            error: {
              message: error instanceof Error ? error.message : "Login failed",
              code: "LOGIN_FAILED",
            },
          });
        }
      },

      // Register action
      register: async (data: SignUpType) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          // TODO: Replace with your actual API call
          const response = await authService.register(data);
          const { data: userData, token } = response;

          set({
            user: userData,
            isLoading: false,
            error: null,
            token: token,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: {
              message:
                error instanceof Error ? error.message : "Registration failed",
              code: "REGISTRATION_FAILED",
            },
          });
        }
      },
      // Forgot password
      forgotPassword: async (data: FogotPasswordType) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          await authService.forgotPassword(data);
          set({
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error) {
          console.log(error);
          set({
            isLoading: false,
            error: {
              message: error instanceof Error ? error.message : "Forgot failed",
              code: "FORGOT_PASSWORD_FAILED",
            },
          });
          return false;
        }
      },
      // Verify Code
      verifyCode: async (data: VerifyCodeType) => {
        set({
          isLoading: true,
          error: null,
        });

        try {
          await authService.verifyCode(data);
          set({
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error) {
          console.log(error);
          set({
            isLoading: false,
            error: {
              message:
                error instanceof Error ? error.message : "Verify Code failed",
              code: "VERIFY_CODE_FAILED",
            },
          });
          return false;
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
        } catch (error) {
          console.log(error);
          set({
            isLoading: false,
            error: {
              message: error instanceof Error ? error.message : "Reset failed",
              code: "RESET_PASSWORD_FAILED",
            },
          });
          return false;
        }
      },
      // Logout action
      logout: () => {
        set({
          user: null,
          token: null,
          error: null,
          isAuthenticated: false,
        });
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
            token: result.token,
          });
        } catch (error) {
          set({
            error: {
              message:
                error instanceof Error ? error.message : "Google login failed",
              code: "GOOGLE_LOGIN_FAILED",
            },
          });
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
            token: result.token,
          });
        } catch (error) {
          set({
            error: {
              message:
                error instanceof Error ? error.message : "GitHub login failed",
              code: "GITHUB_LOGIN_FAILED",
            },
          });
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
            token: result.token,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: {
              message:
                error instanceof Error ? error.message : "Discord login failed",
              code: "DISCORD_LOGIN_FAILED",
            },
          });
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
    }
  )
);
