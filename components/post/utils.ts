export const formatTimeAgo = (
  dateString?: string,
  locale: string = "en"
): string => {
  const date = new Date(dateString ?? new Date());
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export const getCategoryColor = (category?: string): string => {
  const colors: Record<string, string> = {
    general: "#6B7280",
    tech: "#3B82F6",
    travel: "#10B981",
    food: "#F59E0B",
    art: "#8B5CF6",
  };
  if (!category) return colors.general;
  return colors[category] ?? colors.general;
};

export const isImageFile = (filename?: string): boolean => {
  if (!filename) return false;
  const extension = filename.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "");
};
