import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getItem, setItem, deleteItemAsync } from "expo-secure-store";

import { authService, oauthService } from "@/services";
import { LoginCredentials, RegisterData, User } from "@/type/auth.type";
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

  login: (data: LoginCredentials) => Promise<void>;

  register: (data: RegisterData) => Promise<void>;

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

      // Basic actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      // Login action
      login: async (data: LoginCredentials) => {
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
              code: (error as any).code || "LOGIN_FAILED",
            },
          });
        }
      },

      // Register action
      register: async (data: RegisterData) => {
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
          console.log("🚀 ~ register: ~ error:", error);
          set({
            isLoading: false,
            error: {
              message:
                error instanceof Error ? error.message : "Registration failed",
              code: (error as any).code || "REGISTRATION_FAILED",
            },
          });
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
    }
  )
);
