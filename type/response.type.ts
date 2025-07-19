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
  token?: string;
  timestamp: string;
}
export { ApiError, ApiSuccess };
