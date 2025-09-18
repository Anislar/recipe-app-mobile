import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  commentsCount: number;
  expanded: boolean;
  toggleExpand: () => void;
}

export const CommentsHeader: React.FC<HeaderProps> = ({
  commentsCount,
  toggleExpand,
  expanded,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("post.comment.comment") +
          " " +
          (commentsCount ? `(${commentsCount})` : "")}
      </Text>
      <TouchableOpacity style={styles.expandButton} onPress={toggleExpand}>
        {/* Your header content */}
        <Ionicons name={!expanded ? "chevron-up" : "chevron-down"} size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  expandButton: {
    padding: 8,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.grayLight,
  },
});
