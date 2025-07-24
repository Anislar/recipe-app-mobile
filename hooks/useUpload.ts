import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { fileService } from "@/services/api/file.service";
import { showToast } from "@/helpers/toastService";

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: "images",
    });
    if (!result.canceled) {
      await uploadFile(result.assets[0]);
    } else {
      showToast("You did not select image!");
    }
  };
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    if (!result.canceled) {
      await uploadFile(result.assets[0]);
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
      console.log("🚀 ~ uploadFile ~ res:", res);
      showToast("File uploaded successfully!");
      setFile(res.data);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setStatus(STATUS.ERROR);
      console.error("Upload failed:", error);
      showToast("Failed to upload file.");
      return null;
    }
  };

  return { progress, pickDocument, pickImage, status, file };
};

export default useUpload;
