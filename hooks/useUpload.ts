import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { fileService } from "@/services/api/file.service";
import { showToast } from "@/helpers/toastService";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";

interface uploadFileInterface {
  source: "user" | "post";
}
const STATUS = {
  IDLE: "idle",
  UPLOADING: "uploading",
  ERROR: "error",
  SUCCESS: "success",
} as const;
const useUpload = ({ source }: uploadFileInterface) => {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<(typeof STATUS)[keyof typeof STATUS]>(
    STATUS.IDLE
  );
  const [file, setFile] = useState<any>(null);
  const { t } = useTranslation();
  // Pick image
  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted)
      return Alert.alert(
        t("file.permissionDeniedTitle"),
        t("file.permissionDeniedDescription")
      );
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
      mediaTypes: "images",
    });
    if (!result.canceled) {
      return await uploadFile(result.assets[0]);
    } else {
      showToast("You did not select image!");
    }
  };
  // Pick Document
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    if (!result.canceled) {
      return await uploadFile(result.assets[0]);
    } else {
      showToast("You did not select image!");
    }
  };

  // Pick phot
  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted)
      return Alert.alert(
        t("file.permissionDeniedTitle"),
        t("file.permissionDeniedDescription")
      );
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      mediaTypes: "livePhotos",
    });
    if (!result.canceled) {
      return await uploadFile(result.assets[0]);
    } else {
      showToast("You did not select image!");
    }
  };
  const uploadFile = async (
    file: DocumentPicker.DocumentPickerAsset | ImagePicker.ImagePickerAsset
  ) => {
    try {
      setStatus(STATUS.UPLOADING);

      const fileName = file.file?.name || file.uri.split("/").pop() || "image";
      const fileType = file.mimeType || file.file?.type || "image/jpg";
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: fileName,
        type: fileType,
      } as any);
      formData.append("source", source);
      const res = await fileService.uploadFile(formData, setProgress);
      showToast("File uploaded successfully!");
      setFile(res.data);
      setStatus(STATUS.SUCCESS);
      return res.data;
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.error("Upload failed:", error);
      showToast("Failed to upload file.");
      return null;
    }
  };
  const deleteFile = async (fileUrl: string) => {
    try {
      setStatus(STATUS.UPLOADING);

      const formData = new FormData();
      formData.append("file", fileUrl);
      formData.append("source", source);
      await fileService.deleteFile(formData);
      showToast("File Removed successfully!");
      setFile(null);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.error("Upload failed:", error);
      showToast("Failed to remove file.");
      return null;
    }
  };
  return {
    progress,
    pickDocument,
    pickImage,
    takePhoto,
    status,
    file,
    deleteFile,
  };
};

export default useUpload;
