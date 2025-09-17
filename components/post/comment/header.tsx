import { hp, wp } from "@/helpers/common";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  commentsCount: number;
}

export const CommentsHeader: React.FC<HeaderProps> = ({ commentsCount }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("post.comment.comment") +
          " " +
          (commentsCount ? `(${commentsCount})` : "")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  // expandButton: {
  //   padding: 8,
  //   borderRadius: 20,
  //   backgroundColor: "#f8f8f8",
  // },
});
