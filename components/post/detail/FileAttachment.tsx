import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { isImageFile } from "../utils";

const getFileIconName = (filename?: string) => {
  if (!filename) return "insert-drive-file";
  const extension = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    pdf: "picture-as-pdf",
    doc: "description",
    docx: "description",
    xls: "grid-on",
    xlsx: "grid-on",
    ppt: "slideshow",
    pptx: "slideshow",
    txt: "text-snippet",
  };
  return map[extension || ""] || "insert-drive-file";
};

export const FileAttachment: React.FC<{ file?: string }> = ({ file }) => {
  if (!file) return null;

  if (isImageFile(file)) {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: file }} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  const fileName = file.split("/").pop() || "Document";
  const icon = getFileIconName(file);

  return (
    <TouchableOpacity style={styles.attachment} activeOpacity={0.7}>
      <View style={styles.iconBox}>
        <MaterialIcons name={icon as any} size={24} color="#6B7280" />
      </View>
      <Text style={styles.fileName} numberOfLines={1}>
        {fileName}
      </Text>
      <Feather name="download" size={20} color="#6B7280" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#F3F4F6",
  },
  attachment: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
});

export default FileAttachment;
