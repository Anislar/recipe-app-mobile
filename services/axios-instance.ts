import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL! + process.env.EXPO_PUBLIC_API_PREFIX!,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;

    // Prevent infinite retry loop
    if (error?.response?.status === 401 && !config._retry) {
      config._retry = true;

      try {
        const { useAuthStore } = await import("@/store");
        const {
          refreshToken: token,
          setToken,
          logout,
        } = useAuthStore.getState();
        if (token) {
          const response = await api.post("/auth/refresh", {
            refreshToken: token,
          });
          const { accessToken, refreshToken } = response.data.tokenData;
          const newAccessToken = accessToken;
          const newRefreshToken = refreshToken;
          if (newAccessToken) {
            setToken({
              refreshToken: newRefreshToken,
              accessToken: newAccessToken,
            });

            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };

            return axios(config);
          }
        } else {
          await logout();
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(async (config) => {
  const { useAuthStore } = await import("@/store");
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
