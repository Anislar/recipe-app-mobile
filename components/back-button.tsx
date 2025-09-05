import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";

interface BackButtonProps {
  size?: number;
  cb?: () => void;
}
const BackButton = ({ size = 25, cb }: BackButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        cb?.();
        router.back();
      }}
    >
      <MaterialCommunityIcons
        name="arrow-left"
        size={size}
        color={THEME.colors.text}
      />
    </TouchableOpacity>
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
