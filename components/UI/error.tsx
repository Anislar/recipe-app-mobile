import { t } from "i18next";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@/components";

interface ErrorStateProps {
  error: any;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.errorText}>
      {t("common.error")}: {error?.message}
    </Text>
    <Button
      buttonStyle={styles.retryButton}
      onPress={onRetry}
      title={t("common.refresh")}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
