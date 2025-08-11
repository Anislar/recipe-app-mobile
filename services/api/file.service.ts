import { ApiSuccess } from "@/type";
import { api } from "../axios-instance";
import { handleApiError } from "@/helpers/utils";
import { AxiosProgressEvent } from "axios";
class FileService {
  private prefix: string;
  constructor() {
    this.prefix = "/storage";
  }

  async uploadFile(
    data: FormData,
    onProgress: (progress: number) => void
  ): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(this.prefix + "/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (!progressEvent) return;
          const total = progressEvent.total ?? 1; // Avoid division by zero
          const rawProgress = (progressEvent.loaded / total) * 100;
          onProgress(Math.min(Math.round(rawProgress), 100));
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
  async deleteFile(data: FormData): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(this.prefix + "/remove-file", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}

const fileService = new FileService();
export { fileService };
