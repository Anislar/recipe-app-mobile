import { THEME } from "@/constants/theme";
import { View, ActivityIndicator, StyleSheet } from "react-native";
interface LoadingSpinnerProps {
  color?: string;
  size?: "large" | "small";
}

export default function LoadingSpinner({
  size = "large",
  color = THEME.colors.primary,
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
