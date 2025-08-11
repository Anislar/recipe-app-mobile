import { StyleSheet, Text } from "react-native";
import { lazy, Suspense, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ScreenWrapper,
  Button,
  FormWrapper,
  LoadingSpinner,
  PostContent,
  CategorySelector,
  LocationSelector,
  SelectLocation,
} from "@/components";
import { hp, wp } from "@/helpers/common";
import { addPostSchema, AddPostType } from "@/helpers/post";
import useUpload from "@/hooks/useUpload";
import FileSelector from "@/components/post/file-selector";
import { t } from "i18next";
import { usePostStore } from "@/store/post.store";
import { showToast } from "@/helpers/toastService";
import { router } from "expo-router";

const BottomSheetComponent = lazy(() =>
  import("@/components").then((el) => ({ default: el.BottomSheetComponent }))
);

const Category = lazy(() =>
  import("@/components").then((el) => ({ default: el.Category }))
);
const SelectFile = lazy(() =>
  import("@/components").then((el) => ({ default: el.SelectFile }))
);

type BottomSheetType = "category" | "file" | "location";
const AddPost = () => {
  const bottomSheetRef = useRef<any>(null);
  const {
    progress,
    pickDocument,
    pickImage,
    takePhoto,
    status,
    file,
    deleteFile,
  } = useUpload({
    source: "post",
  });
  const { control, handleSubmit, watch, setValue, reset } =
    useForm<AddPostType>({
      resolver: zodResolver(addPostSchema),
    });
  const [step, setStep] = useState<BottomSheetType>("category");
  const categorySelected = watch("category");
  const { isLoading, addPost } = usePostStore();
  const handlePost: SubmitHandler<AddPostType> = async (data: AddPostType) => {
    const response = await addPost(data);
    if (typeof response === "string") {
      showToast(t("post.createSuccess"));
      reset();
      router.back();
    }
  };
  const handleOpenBottomSheet = (item: BottomSheetType) => {
    setStep(item);
    bottomSheetRef.current?.snapToIndex(0);
  };
  const handleUploadFile = async (type: string) => {
    let result: any = null;
    bottomSheetRef.current.close();
    switch (type) {
      case "photo":
        result = await takePhoto();
        break;
      case "image":
        result = await pickImage();
        break;
      case "document":
        result = await pickDocument();
        break;
      default:
        break;
    }
    setValue("file", result?.url, { shouldValidate: true });
  };
  const BottomSheetContent = {
    file: {
      snapPoints: ["25%"],
      content: (
        <SelectFile
          takePhoto={() => handleUploadFile("camera")}
          pickImage={() => handleUploadFile("image")}
          pickDocument={() => handleUploadFile("document")}
        />
      ),
    },

    category: {
      snapPoints: ["50%"],

      content: (
        <Category
          itemSelected={categorySelected?.value!}
          onChange={(item) => {
            setValue("category", item, { shouldValidate: true });
            setTimeout(() => {
              bottomSheetRef.current.close();
            }, 300);
          }}
        />
      ),
    },
    location: {
      snapPoints: ["40%"],

      content: (
        <SelectLocation
          close={() => bottomSheetRef.current.close()}
          control={control}
        />
      ),
    },
  };
  return (
    <ScreenWrapper bg="white">
      <FormWrapper style={styles.content}>
        {/* Content */}
        <PostContent control={control} />
        {/* Category */}
        <CategorySelector
          control={control}
          onOpen={() => handleOpenBottomSheet("category")}
        />
        {/* File */}
        <FileSelector
          deleteFile={(url) => {
            setValue("file", undefined);
            deleteFile(url);
          }}
          file={file}
          status={status}
          progress={progress}
          onOpen={() => handleOpenBottomSheet("file")}
        />
        {/* Location */}
        <LocationSelector
          labelExterne
          control={control}
          onOpen={() => handleOpenBottomSheet("location")}
        />
        {/* Submit */}
        <Button
          loading={isLoading}
          onPress={handleSubmit(handlePost)}
          title={t("common.submit")}
        />
      </FormWrapper>
      <Suspense fallback={<LoadingSpinner />}>
        <BottomSheetComponent
          snapPoints={BottomSheetContent[step]?.snapPoints}
          ref={bottomSheetRef}
        >
          {BottomSheetContent[step].content}
        </BottomSheetComponent>
      </Suspense>
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  content: {
    paddingHorizontal: wp(2.6),
    gap: hp(2),
  },
});

export default AddPost;
