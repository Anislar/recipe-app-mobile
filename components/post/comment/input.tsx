import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";
import { memo, useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CommentInputProps {
  onSubmit: (content: string) => Promise<boolean>;
  isLoading: boolean;
}

export const CommentInput: React.FC<CommentInputProps> = memo(
  ({ onSubmit, isLoading }) => {
    const [newComment, setNewComment] = useState("");
    // Handle changeText
    const onChangeText = useCallback(async (text: string) => {
      setNewComment(text);
    }, []);
    // Handle submit
    const handleSubmit = useCallback(async () => {
      const res = await onSubmit(newComment);
      if (res) setNewComment("");
    }, [onSubmit, newComment]);
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <TextInput
            style={styles.input}
            value={newComment}
            onChangeText={onChangeText}
            placeholder={t("post.comment.placeholder")}
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!newComment.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!newComment.trim() || isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);
CommentInput.displayName = "CommentInput";
const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    maxHeight: 100,
    backgroundColor: "#f8f8f8",
    textAlignVertical: "top",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
