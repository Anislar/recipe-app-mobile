import { Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { THEME } from "@/constants/colors";

interface BackButtonProps {
  size?: number;
}
const BackButton = ({ size = 25 }: BackButtonProps) => {
  const router = useRouter();
  return (
    <Pressable style={styles.button} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={size} color={THEME.colors.text} />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: THEME.radius.sm,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
