import { THEME } from "@/constants/theme";
import React from "react";
import { Text, StyleSheet } from "react-native";

interface Props {
  content: string;
}

export const PostContent: React.FC<Props> = ({ content }) => {
  // Split text into words and detect hashtags
  const words = content.split(/(\s+|[.,:;!?]+)/g).filter(Boolean);

  return (
    <Text style={styles.postContent}>
      {words.map((word, index) => {
        if (word.startsWith("#")) {
          return (
            <Text key={index} style={styles.hashtag}>
              {word}
            </Text>
          );
        }
        return word;
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
    marginBottom: 12,
  },
  hashtag: {
    color: "#4169E1",
    fontWeight: THEME.fonts.medium,
  },
});
