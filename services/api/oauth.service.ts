import { authService } from "./auth.service";

export interface OAuthConfig {
  config: {
    androidClientId?: string;
    clientId: string;
    scopes: string[];
    redirectUri: string;
    usePKCE: boolean;
  };
  discovery: {
    authorizationEndpoint: string;
  };
}

export interface OAuthCallbackData {
  code: string;
  codeVerifier?: string;
}

export class OAuthService {
  private redirectUri: string;

  constructor() {
    this.redirectUri = `${
      process.env.EXPO_PUBLIC_API_URL! + process.env.EXPO_PUBLIC_API_PREFIX!
    }/auth`;
  }

  async handleOAuthCallback(
    provider: "google" | "github" | "discord",
    data: OAuthCallbackData
  ) {
    try {
      const result = await authService.oauthCallback(provider, {
        code: data.code,
        codeVerifier: data.codeVerifier,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
  getOAuthConfig(provider: "github" | "discord" | "google"): OAuthConfig {
    const configs = {
      google: {
        config: {
          androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID!,
          scopes: ["email", "profile", "openid"],
          clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
          usePKCE: false,
          redirectUri: `${this.redirectUri}/google/callback`,
        },
        discovery: {
          authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
          tokenEndpoint: "https://oauth2.googleapis.com/token",
          revocationEndpoint: "https://oauth2.googleapis.com/revoke",
        },
      },
      github: {
        config: {
          clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
          scopes: ["read:user", "user:email"],
          redirectUri: `${this.redirectUri}/github/callback`,

          usePKCE: false,
        },
        discovery: {
          authorizationEndpoint: "https://github.com/login/oauth/authorize",
        },
      },
      discord: {
        config: {
          clientId: process.env.EXPO_PUBLIC_DISCORD_CLIENT_ID!,
          scopes: ["identify", "email"],
          redirectUri: `${this.redirectUri}/discord/callback`,

          usePKCE: false,
        },
        discovery: {
          authorizationEndpoint: "https://discord.com/oauth2/authorize",
        },
      },
    };
    return configs[provider];
  }
}

export const oauthService = new OAuthService();
