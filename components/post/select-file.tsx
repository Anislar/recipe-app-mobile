import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import { Separator } from "../UI/separator";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSelectedColors } from "@/store";
import { useTranslation } from "react-i18next";

interface FileProps {
  takePhoto: () => void;
  pickImage: () => void;
  pickDocument: () => void;
}
const SelectFile = ({ pickImage, takePhoto, pickDocument }: FileProps) => {
  const selected = useSelectedColors();
  const { t } = useTranslation();

  const FILE_OPTIONS = [
    { label: t("post.file.photo"), icon: "camera", onPress: takePhoto },
    { label: t("post.file.image"), icon: "image", onPress: pickImage },
    { label: t("post.file.file"), icon: "file", onPress: pickDocument },
  ];

  return (
    <View style={styles.content}>
      <Text style={styles.title}>{t("post.file.placeholder")}:</Text>
      <Text style={styles.subtitle}>{t("post.file.subtitle")}</Text>
      <FlatList
        scrollEnabled={false}
        data={FILE_OPTIONS}
        horizontal
        keyExtractor={(item) => item.label.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <Separator mx={wp(5)} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            activeOpacity={0.7}
            onPress={item.onPress}
          >
            <View style={styles.name}>
              <MaterialCommunityIcons
                name={item.icon as any}
                size={24}
                color={selected.primary}
              />
              <Text style={styles.label}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: hp(0.5),
  },
  title: {
    fontSize: hp(2),
    fontWeight: THEME.fonts.semibold,
    color: THEME.colors.text,
  },
  subtitle: {
    paddingVertical: 5,
    fontSize: hp(1.4),
    fontWeight: THEME.fonts.medium,
    color: THEME.colors.darkGray,
  },
  listContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.5),
  },
  name: {
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
export default SelectFile;
