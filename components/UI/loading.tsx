import { useSelectedColors } from "@/store";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { THEME } from "@/constants/theme";

interface LoadingSpinnerProps {
  color?: string;
  size?: "large" | "small";
}

export const LoadingSpinner = ({
  size = "large",
  color,
}: LoadingSpinnerProps) => {
  const selected = useSelectedColors();

  // Use fallback color if theme is not hydrated yet
  const spinnerColor = color || selected?.primary || THEME.colors.rose;

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={spinnerColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
