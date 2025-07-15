import React, { useRef, useState } from "react";
import { FieldError } from "react-hook-form";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

interface ITokenInputComponent {
  containerStyles?: StyleProp<ViewStyle>;
  onTokenComplete: (input: string) => void;
}
// Token Input Component
const TokenInputComponent = ({
  containerStyles,
  onTokenComplete,
  ...props
}: ITokenInputComponent) => {
  const [token, setToken] = useState(["1", "2", "3", "4"]);
  //const inputRefs = useRef<TextInput>([]);

  return (
    <View style={styles.tokenContainer}>
      <View style={[styles.inputsRow, containerStyles]}>
        {token.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.tokenInput, styles.tokenInputError]}
            value={digit}
            onChangeText={(value) => {
              // Only allow single digit
              const cleanValue = value.replace(/\D/g, "").slice(-1);
            }}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
            {...props}
          />
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 40,
  },
  tokenContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  tokenInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  tokenInputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    marginTop: 20,
  },
});
export default TokenInputComponent;
