import Ionicons from "@expo/vector-icons/Ionicons";

export type CategoryIDs =
  | "general"
  | "tech"
  | "travel"
  | "food"
  | "art"
  | "fitness"
  | "lifestyle";
export type CategoryType = {
  id: CategoryIDs;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};
