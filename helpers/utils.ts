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
export const isImageUrl = (url?: string) =>
  !!url && /(\.png|\.jpg|\.jpeg|\.gif|\.webp)$/i.test(url);

export const formatDate = (value?: string, locale: string = "en") => {
  if (!value) value = "";
  const d = new Date(value || new Date());
  if (Number.isNaN(d.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      timeStyle: "short",
    }).format(d);
  } catch {
    return d.toLocaleString(locale);
  }
};
export const addHttps = (url: string) => {
  if (!url.startsWith("https")) return url.replace("http", "https");
  return url;
};
