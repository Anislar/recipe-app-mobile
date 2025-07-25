import { StyleSheet, View, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

interface IFormWrapper {
  children: React.ReactNode;
}
const FormWrapper = ({ children }: IFormWrapper) => {
  return (
    <KeyboardAwareScrollView
      bottomOffset={64}
      contentContainerStyle={styles.container}
      style={{
        flex: 1,
        padding: 5,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          padding: 5,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>{children}</View>
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
