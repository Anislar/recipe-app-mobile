import { StyleSheet } from "react-native";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import { router } from "expo-router";

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
import { addPostSchema, AddPostType, Post } from "@/helpers/post";
import useUpload from "@/hooks/useUpload";
import FileSelector from "@/components/post/file-selector";

import { usePostStore } from "@/store/post.store";
import { showToast } from "@/helpers/toastService";

const BottomSheetComponent = lazy(() =>
  import("@/components").then((el) => ({ default: el.BottomSheetComponent }))
);

const SelectCategory = lazy(() =>
  import("@/components").then((el) => ({ default: el.SelectCategory }))
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
  const { isLoading, addPost, setPost, post } = usePostStore();

  const { control, handleSubmit, watch, setValue, reset } =
    useForm<AddPostType>({
      resolver: zodResolver(addPostSchema),
      defaultValues: {
        category: (post?.category as any) ?? "",
        content: post?.content ?? "",
        file: post?.file ?? undefined,
        location: post?.location ?? undefined,
      },
    });
  const [step, setStep] = useState<BottomSheetType>("category");
  const [categorySelected, setCategorySelected] = useState<{
    value: string;
    label: string;
    icon: string;
  } | null>(null);

  // open bottomSheet
  const handleOpenBottomSheet = (item: BottomSheetType) => {
    setStep(item);
    bottomSheetRef.current?.expand();
  };
  // handle upload
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

  // BottomSheetContent
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
        <SelectCategory
          itemSelected={categorySelected?.value!}
          onChange={(item) => {
            setValue("category", item.value, { shouldValidate: true });
            setCategorySelected(item);
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

  // handle Submission in real time
  useEffect(() => {
    const subscription = watch((values) => setPost(values as Post));
    return () => subscription.unsubscribe();
  }, [watch, setPost]);

  useEffect(() => {
    if (post) {
      reset({
        category: (post.category as any) ?? "",
        content: post.content ?? "",
        file: post.file ?? undefined,
        location: post.location ?? undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.content, reset]);

  // submit
  const handlePost: SubmitHandler<AddPostType> = async (data: AddPostType) => {
    const response = await addPost(data);
    if (typeof response === "string") {
      showToast(t("post.createSuccess"));
      reset();
      router.back();
    }
  };
  return (
    <ScreenWrapper bg="white">
      <FormWrapper style={styles.content}>
        {/* Content */}
        <PostContent control={control} />
        {/* SelectCategory */}
        <CategorySelector
          itemSelected={categorySelected}
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
          type="text"
          onPress={() => {
            setPost(null);
            reset({
              category: undefined,
              content: "",
              file: undefined,
              location: undefined,
            });
            setCategorySelected(null);
          }}
          title={t("common.cancel")}
        />
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
