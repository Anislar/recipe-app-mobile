import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getItem, setItem, deleteItemAsync } from "expo-secure-store";

import { authService } from "@/services";
import { LoginCredentials, RegisterData, User } from "@/type/auth.type";
export interface AuthState {
  isLoading: boolean;
  error: string | null;

  // User data
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  // User data
  setUser: (user: AuthState["user"]) => void;
  setToken: (token: AuthState["token"]) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;

  login: (data: LoginCredentials) => Promise<void>;

  register: (data: RegisterData) => Promise<void>;

  // Logout
  logout: () => void;

  // OAuth
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithDiscord: () => Promise<void>;
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
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(data);
          const { user, token } = response;
          set({
            user,
            isLoading: false,
            error: null,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.log("🚀 ~ login: ~ error:", error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Login failed",
          });
        }
      },

      // Register action
      register: async (data) => {
        set({ isLoading: true, error: null });

        try {
          // Validate passwords match
          if (data.password !== data.confirmPassword) {
            throw new Error("Passwords do not match");
          }

          // TODO: Replace with your actual API call
          const response = await fetch("YOUR_API_URL/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: data.name,
              email: data.email,
              password: data.password,
            }),
          });

          if (!response.ok) {
            throw new Error("Registration failed");
          }

          const responseData = await response.json();

          set({
            user: responseData.user,
            isLoading: false,
            error: null,
            token: responseData.token,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Registration failed",
          });
        }
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          error: null,
          isAuthenticated: false,
        });
      },

      // OAuth actions
      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });

        try {
          // The OAuth flow is handled in the individual button components
          // This method is called after successful OAuth callback
          set({ isLoading: false, isAuthenticated: true });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Google login failed",
          });
        }
      },

      loginWithGithub: async () => {
        set({ isLoading: true, error: null });

        try {
          // The OAuth flow is handled in the individual button components
          // This method is called after successful OAuth callback
          set({ isLoading: false, isAuthenticated: true });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "GitHub login failed",
          });
        }
      },

      loginWithDiscord: async () => {
        set({ isLoading: true, error: null });

        try {
          // The OAuth flow is handled in the individual button components
          // This method is called after successful OAuth callback
          set({ isLoading: false, isAuthenticated: true });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Discord login failed",
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
