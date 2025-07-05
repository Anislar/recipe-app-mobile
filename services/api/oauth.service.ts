import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { authService } from "./auth.service";

WebBrowser.maybeCompleteAuthSession();

export interface OAuthConfig {
  clientId: string;
  scopes: string[];
  redirectUri: string;
  authorizationEndpoint: string;
  tokenEndpoint?: string;
}

export class OAuthService {
  private redirectUri: string;

  constructor() {
    this.redirectUri = AuthSession.makeRedirectUri({
      native: "com.anonymous.frontend",
    });
  }

  async handleOAuthCallback(
    provider: "google" | "github" | "discord",
    response: AuthSession.AuthSessionResult
  ) {
    if (response.type === "success" && response.params.code) {
      try {
        // Send the authorization code to your backend
        const result = await authService.oauthCallback(provider, {
          code: response.params.code,
          redirectUri: this.redirectUri,
        });
        return result;
      } catch (error) {
        console.error(`OAuth callback error for ${provider}:`, error);
        throw error;
      }
    } else if (response.type === "error") {
      throw new Error(
        `OAuth error: ${response.error?.message || "Unknown error"}`
      );
    }
  }

  getOAuthConfig(provider: "google" | "github" | "discord"): OAuthConfig {
    const configs = {
      google: {
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
        scopes: ["email", "profile"],
        redirectUri: this.redirectUri,
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      },
      github: {
        clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
        scopes: ["read:user", "user:email"],
        redirectUri: `${process.env.EXPO_PUBLIC_API_URL}/auth/github/callback`,
        authorizationEndpoint: "https://github.com/login/oauth/authorize",
      },
      discord: {
        clientId: process.env.EXPO_PUBLIC_DISCORD_CLIENT_ID!,
        scopes: ["identify", "email"],
        redirectUri: this.redirectUri,
        authorizationEndpoint: "https://discord.com/oauth2/authorize",
      },
    };

    return configs[provider];
  }
}

export const oauthService = new OAuthService();
