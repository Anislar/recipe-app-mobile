import { StyleProp, StyleSheet, View, ViewStyle, LogBox } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
LogBox.ignoreLogs([/DEBUG  maybeScroll - onChangeText/]);
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
      <View style={[styles.inner, style, { marginBottom: mb }]}>
        {children}
      </View>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  inner: {
    padding: 5,
    justifyContent: "center",
  },
});

export default FormWrapper;
