import { ApiQueryParams, ApiSuccess } from "@/type";
import { api } from "../axios-instance";
import { handleApiError } from "@/helpers/utils";

class NotificationService {
  private prefix: string;
  constructor() {
    this.prefix = "notification";
  }

  async getNotifications(data: ApiQueryParams): Promise<ApiSuccess<any>> {
    try {
      const response = await api.get(this.prefix, {
        params: {
          page: data.page ?? 1,
          limit: data.limit ?? 15,
          filter: data.filter,
          sortOrder: data.sortOrder ?? "desc",
        },

        signal: data.signal,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  async markedRead(notificaitonId: number): Promise<ApiSuccess<any>> {
    try {
      const response = await api.patch(`${this.prefix}/${notificaitonId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
  async delete(notificationId: number): Promise<ApiSuccess<any>> {
    try {
      const response = await api.delete(`${this.prefix}/${notificationId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}

const notificationService = new NotificationService();
export { notificationService };
