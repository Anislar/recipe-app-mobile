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
  mb?: number;
}
const FormWrapper = ({ children, style, mb = 64 }: IFormWrapper) => {
  return (
    <KeyboardAwareScrollView
      bottomOffset={mb}
      contentContainerStyle={styles.container}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.inner, style, { marginBottom: mb }]}>
          {children}
        </View>
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
    justifyContent: "center",
  },
});

export default FormWrapper;
