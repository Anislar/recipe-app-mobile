import { ApiError } from "@/type";

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const handleApiError = (error: any) => {
  if (error.response?.data) {
    const apiError: ApiError = error.response.data;
    throw apiError;
  }
  throw error;
};
