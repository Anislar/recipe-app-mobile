import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { hp, wp } from "@/helpers/common";
import { useSelectedColors } from "@/store";
import { THEME } from "@/constants/theme";

export const PlusButton = () => {
  const selected = useSelectedColors();
  return (
    <TouchableOpacity
      style={[
        styles.plusButton,
        {
          backgroundColor: selected.primary,
        },
      ]}
      activeOpacity={0.7}
      onPress={() => router.push("/add-post")}
    >
      <MaterialCommunityIcons name="plus" color="white" size={wp(10)} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  plusButton: {
    top: -hp(2.5),
    left: hp(1.5),
    justifyContent: "center",
    alignItems: "center",
    width: hp(8),
    height: hp(8),
    borderRadius: THEME.radius.lg,
    //flex: 1,

    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
