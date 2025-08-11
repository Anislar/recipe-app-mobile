import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useSelectedColors } from "@/store";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { THEME } from "@/constants/theme";
import { LoadingSpinner } from "../UI/loading";
import { Image } from "expo-image";
import { hp, wp } from "@/helpers/common";
import { getUserImage } from "@/helpers/user.utils";

interface FileSelectorProps {
  onOpen: () => void;
  file: {
    type: string;
    url: string;
    size: number;
    name: string;
  };
  progress: number;
  status: "uploading" | "error" | "idle" | "success";
  deleteFile: (url: string) => void;
}
const FileSelector = ({
  onOpen,
  deleteFile,
  status,
  file,
  progress,
}: FileSelectorProps) => {
  const selected = useSelectedColors();
  const { t } = useTranslation();
  const isImage = file?.type?.startsWith("image");
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.label}>{t("post.file.label")}:</Text>

      <TouchableOpacity
        style={[
          styles.selectorButton,
          {
            flexDirection: "column",
            borderStyle: "dashed",
          },
        ]}
        onPress={() => onOpen()}
        activeOpacity={0.7}
      >
        <View style={styles.button}>
          <View style={styles.button}>
            <MaterialCommunityIcons
              name="plus-circle"
              size={28}
              color={selected.primary}
            />
            <Text style={styles.label}>{t("post.file.placeholder")}</Text>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={28}
            color={THEME.colors.darkGray}
          />
        </View>

        {status === "uploading" ? (
          <View style={[styles.container, styles.imageContainer]}>
            <LoadingSpinner />
            {Number(progress) < 100 && (
              <Text style={styles.progressText}>{progress}%</Text>
            )}
          </View>
        ) : status === "success" && file ? (
          <View style={[styles.container, isImage && styles.imageContainer]}>
            {isImage && (
              <View style={styles.imageContainer}>
                <Image
                  source={getUserImage(file?.url)}
                  transition={100}
                  style={styles.images}
                />
                <TouchableOpacity
                  style={styles.iconClose}
                  onPress={() => {
                    deleteFile(file?.url);
                  }}
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    color={THEME.colors.rose}
                    size={28}
                  />
                </TouchableOpacity>
              </View>
            )}
            {!isImage && (
              <View style={styles.button}>
                <MaterialCommunityIcons
                  name="file"
                  size={hp(3.5)}
                  color={selected.primary}
                />
                <View style={styles.fileContainer}>
                  <View>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.label,
                        { color: selected.primary, fontSize: hp(1.8) },
                      ]}
                    >
                      {file?.name ?? "document.pdf"}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.label,
                        { color: THEME.colors.darkGray, fontSize: hp(1.8) },
                      ]}
                    >
                      {file?.size ?? "50kb"}
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    onPress={() => {
                      deleteFile(file?.url);
                    }}
                    name="trash-can"
                    color={THEME.colors.rose}
                    size={28}
                  />
                </View>
              </View>
            )}
          </View>
        ) : null}

        {status === "error" && (
          <View style={styles.button}>
            <Text style={styles.errorText}>🚨 {t("common.errorImage")}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    gap: hp(1),
    flex: 1,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  selectorButton: {
    flexDirection: "row",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(2),
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.gray,
  },
  label: {
    fontSize: hp(1.6),
    color: THEME.colors.text,
    fontWeight: THEME.fonts.medium,
  },

  errorText: {
    color: THEME.colors.rose,
    fontSize: hp(1.5),
    marginLeft: 5,
  },
  container: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    marginVertical: hp(1),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(2),
    borderRadius: THEME.radius.sm,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: THEME.colors.darkLight,
  },
  imageContainer: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    height: hp(13),
    width: hp(13),
  },
  progressText: {
    marginTop: 12,
    fontSize: hp(2),
    fontWeight: "500",
    color: THEME.colors.darkGray,
  },
  images: {
    height: hp(10),
    width: hp(10),
    borderRadius: THEME.radius.sm,
  },
  iconClose: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    gap: wp(5),
  },
});
export default FileSelector;
