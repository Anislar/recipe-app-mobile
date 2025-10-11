interface ApiError {
  success: false;
  message: string;
  code: string;
  errors?: {
    field: string;
    message: string;
    code: string;
  }[];
  timestamp: string;
}

interface ApiSuccess<T> {
  success: true;
  message: string;
  data?: T;
  tokenData: {
    accessToken: string;
    refreshToken: string;
  };
  timestamp: string;
}
interface ApiQueryParams<F = Record<string, any>> {
  signal?: any;
  page?: number;
  limit?: number;
  filters?: F;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
export { ApiError, ApiSuccess, ApiQueryParams };
