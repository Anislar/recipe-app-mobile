import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { Button } from "../UI/button";

interface NoPostsProps {
  onRefresh?: () => void;
  showRefreshButton?: boolean;
}

export const NoPosts: React.FC<NoPostsProps> = ({
  onRefresh,
  showRefreshButton = true,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📝</Text>
      </View>

      <Text style={styles.title}>{t("post.empty.title")}</Text>

      <Text style={styles.subtitle}>{t("post.empty.subtitle")}</Text>

      {showRefreshButton && (
        <Button
          title={t("common.refresh", "Refresh")}
          onPress={onRefresh}
          icon="refresh"
          buttonStyle={styles.refreshButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(8),
    paddingVertical: hp(10),
  },
  iconContainer: {
    marginBottom: hp(3),
  },
  icon: {
    fontSize: hp(8),
    textAlign: "center",
  },
  title: {
    fontSize: hp(2.8),
    fontWeight: THEME.fonts.bold,
    color: THEME.colors.dark,
    textAlign: "center",
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: hp(2),
    color: THEME.colors.gray,
    textAlign: "center",
    lineHeight: hp(2.8),
    marginBottom: hp(4),
  },
  refreshButton: {
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.5),
    gap: 5,
  },
});
