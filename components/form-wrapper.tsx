import {
  StyleSheet,
  View,
  ScrollView,
  StyleProp,
  ViewStyle,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

interface IFormWrapper {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
const FormWrapper = ({ children, style }: IFormWrapper) => {
  return (
    <KeyboardAwareScrollView
      bottomOffset={64}
      contentContainerStyle={styles.container}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.inner, style]}>{children}</View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inner: {
    flex: 1,
    padding: 5,
    marginBottom: 64,
    justifyContent: "center",
  },
});

export default FormWrapper;
