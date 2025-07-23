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
    onProgess: (progress: number) => void
  ): Promise<ApiSuccess<any>> {
    try {
      const response = await api.post(this.prefix + "/upload", data, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (!progressEvent) return;
          const rawProgress =
            (progressEvent.loaded / progressEvent.total!) * 100;
          onProgess(Math.round(rawProgress));
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
