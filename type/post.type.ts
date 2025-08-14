import Ionicons from "@expo/vector-icons/Ionicons";

export type CategoryType = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};
