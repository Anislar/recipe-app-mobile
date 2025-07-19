import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";

interface IFormWrapper {
  children: React.ReactNode;
}
const FormWrapper = ({ children }: IFormWrapper) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
  },
});

export default FormWrapper;
