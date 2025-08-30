import { THEME } from "@/constants/theme";
import { useMemo, memo } from "react";
import { Text, StyleSheet } from "react-native";

interface Props {
  content: string;
}

export const PostContent = memo(({ content }: Props) => {
  // Memoize the expensive text processing operation
  const processedContent = useMemo(() => {
    // Split text into words and detect hashtags
    const words = content.split(/(\s+|[.,:;!?]+)/g).filter(Boolean);

    return words.map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <Text key={index} style={styles.hashtag}>
            {word}
          </Text>
        );
      }
      return word;
    });
  }, [content]);

  return <Text style={styles.postContent}>{processedContent}</Text>;
});

PostContent.displayName = "PostContent";

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
