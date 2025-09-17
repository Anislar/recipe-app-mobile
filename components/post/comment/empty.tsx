import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const EmptyCommentsState = () => (
  <View style={styles.container}>
    <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
    <Text style={styles.title}>No comments yet</Text>
    <Text style={styles.subtitle}>Be the first to share your thoughts!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
