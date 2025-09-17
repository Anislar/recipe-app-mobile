import { LoadingSpinner } from "@/components/UI/loading";
import { Separator } from "@/components/UI/separator";
import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";
import { StyleSheet, Text, View } from "react-native";

interface ListFooterComponentProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  size: number;
  text: string;
}

export const ListFooterComponent: React.FC<ListFooterComponentProps> = ({
  hasNextPage,
  isFetchingNextPage,
  size,
  text,
}) => {
  if (!hasNextPage) return null;

  return (
    <View style={styles.loadingMore}>
      {hasNextPage || isFetchingNextPage ? (
        <LoadingSpinner size="large" />
      ) : (
        size > 0 && (
          <View>
            <Separator />
            <Text style={styles.norMore}> {text} </Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  norMore: {
    fontSize: hp(2.5),
    marginBottom: hp(2.5),
    color: THEME.colors.gray,
    textAlign: "center",
    fontWeight: THEME.fonts.medium,
  },
  loadingMore: {
    marginBottom: hp(4),
  },
});
