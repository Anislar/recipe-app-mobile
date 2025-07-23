import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { fileService } from "@/services/api/file.service";
import { showToast } from "@/helpers/toastService";

interface uploadFileInterface {
  source: "user" | "post";
}
const useUpload = ({ source }: uploadFileInterface) => {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

      console.log(result);
    } else {
      showToast("You did not select image!");
    }
  };
  const uploadFile = async (
    file: DocumentPicker.DocumentPickerAsset | ImagePicker.ImagePickerAsset
  ) => {
    try {
      setUploading(true);
      const formData = new FormData();
      console.log(file);
      //return;
      formData.append("file", {
        uri: file.uri,
        file: file.file,
        mimeType: file.mimeType,
      } as any);
      formData.append("source", source);

      const res = await fileService.uploadFile(formData, setProgress);

      showToast("File uploaded successfully!");
      return res.data;
    } catch (error) {
      console.error("Upload failed:", error);
      showToast("Failed to upload file.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { progress, pickDocument, pickImage, uploading };
};

export default useUpload;
