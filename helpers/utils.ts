import { ApiError } from "@/type";
import { t } from "i18next";
import { formatDistance, parse } from "date-fns";
import { fr, enUS } from "date-fns/locale";

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

// export const formatTimeAgo = (dateInput: string): string => {
//   const date = new Date(dateInput);

//   if (isNaN(date.getTime())) return "";

//   const now = new Date();
//   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//   const intervals = [
//     { label: "year", seconds: 31536000 },
//     { label: "month", seconds: 2592000 },
//     { label: "week", seconds: 604800 },
//     { label: "day", seconds: 86400 },
//     { label: "hour", seconds: 3600 },
//     { label: "minute", seconds: 60 },
//   ];

//   for (const interval of intervals) {
//     const count = Math.floor(diffInSeconds / interval.seconds);
//     if (count >= 1) {
//       return t(`common.timeAgo.${interval.label}`, { count });
//     }
//   }

//   return t("common.timeAgo.now");
// };
export const formatTimeAgo = (date: string, locale: string = "en") => {
  const newDate = new Date(date);

  if (isNaN(newDate.getTime())) return "";

  return formatDistance(date, new Date(), {
    addSuffix: true, // "ago" / "il y a"
    locale: locale === "fr" ? fr : enUS,
  });
};

export const addHttps = (url: string) => {
  if (!url.startsWith("https")) return url.replace("http", "https");
  return url;
};
