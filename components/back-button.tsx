import { Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAuthStore } from "@/store";
import { hp } from "@/helpers/common";
import { THEME } from "@/constants/theme";

interface BackButtonProps {
  size?: number;
}
const BackButton = ({ size = 25 }: BackButtonProps) => {
  const reset = useAuthStore((state) => state.setResetElement);
  return (
    <Pressable
      style={styles.button}
      onPress={() => {
        reset();
        router.back();
      }}
    >
      <MaterialCommunityIcons
        name="arrow-left"
        size={size}
        color={THEME.colors.text}
      />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    padding: 5,
    height: hp(5),
    width: hp(5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: THEME.radius.lg,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
