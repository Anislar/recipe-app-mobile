import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { wp } from "@/helpers/common";
const ScreenWrapper = ({
  children,
  bg,
}: {
  children: React.ReactNode;
  bg: string;
}) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 20;
  return (
    <>
      <StatusBar style="auto" />
      <View style={[styles.container, { backgroundColor: bg, paddingTop }]}>
        {children}
      </View>
    </>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(0.5),
  },
});
