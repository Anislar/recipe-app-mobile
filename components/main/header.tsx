import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Alert,
} from "react-native";
import React from "react";
import BackButton from "../back-button";
import { hp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthStore } from "@/store";
import LoadingSpinner from "../UI/loading";

interface IHeaderMain {
  title: string;
  showBackButton: boolean;
  style?: StyleProp<ViewStyle>;
}
const HeaderMain = ({ title, showBackButton, style }: IHeaderMain) => {
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  return (
    <View style={[styles.container, style]}>
      {showBackButton && <BackButton />}
      <Text style={styles.title}>{title || ""}</Text>
      <View style={styles.icon}>
        {isLoading ? (
          <LoadingSpinner size="small" color={THEME.colors.rose} />
        ) : (
          <Ionicons
            onPress={async () => await logout()}
            name="log-out-outline"
            size={26}
            color={THEME.colors.rose}
          />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  icon: {
    backgroundColor: "#fee2e2",
    borderRadius: THEME.radius.sm,
    padding: 5,
  },
  title: {
    alignSelf: "center",
    fontSize: hp(2.7),
    fontWeight: THEME.fonts.semibold,
    color: THEME.colors.text,
  },
});
export default HeaderMain;
