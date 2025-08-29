import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { wp } from "@/helpers/common";
const ScreenWrapper = ({
  children,
  bg,
  pt,
}: {
  children: React.ReactNode;
  bg: string;
  pt?: number;
}) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = typeof pt !== "undefined" ? pt : top > 25 ? 25 : top;
  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop }]}>
      <StatusBar style="dark" />
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(0.5),
  },
});
