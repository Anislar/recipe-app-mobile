import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import { Separator } from "../UI/separator";
import { useSelectedColors } from "@/store";

const CATEGORY_OPTIONS = [
  { label: "General", value: "general", icon: "home" },
  { label: "Tech", value: "tech", icon: "chip" },
  { label: "Travel", value: "travel", icon: "airplane" },
  { label: "Food", value: "food", icon: "food" },
  { label: "Art", value: "art", icon: "palette" },
];
interface CategoryProps {
  onChange: (item: any) => void;
  itemSelected: string;
}
const Category = ({ onChange, itemSelected }: CategoryProps) => {
  const selected = useSelectedColors();
  const { t } = useTranslation();
  return (
    <>
      <Text style={styles.categoryTitle}>{t("post.category.title")} :</Text>
      <FlatList
        scrollEnabled={false}
        data={CATEGORY_OPTIONS}
        keyExtractor={(item) => item.value.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <Separator my={2} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryItemContainer}
            activeOpacity={0.7}
            onPress={() => onChange(item)}
          >
            <View style={styles.categoryName}>
              <MaterialCommunityIcons
                name={item.icon as any}
                size={24}
                color={selected.primary}
              />
              <Text style={styles.label}>{item.label}</Text>
            </View>

            {item.value === itemSelected && (
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="#009b58"
              />
            )}
          </TouchableOpacity>
        )}
      />
    </>
  );
};
const styles = StyleSheet.create({
  categoryTitle: {
    fontSize: hp(2),
    fontWeight: THEME.fonts.semibold,
    color: THEME.colors.text,
    paddingVertical: 10,
  },
  listContainer: {
    paddingHorizontal: wp(2),
  },
  categoryItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.5),
  },
  categoryName: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2.5),
  },
  label: {
    fontSize: hp(1.9),
    fontWeight: THEME.fonts.medium,
    color: THEME.colors.text,
  },
});
export default Category;
