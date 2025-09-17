import { addPostSchema, PostType } from "@/schema/post";
import { showToast } from "@/helpers/toastService";
import { ApiSuccess } from "@/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useUpload from "../useUpload";
import { usePostMutations } from "./useMutationPost";

export const useSetPost = () => {
  const { t } = useTranslation();
  // user hooks
  const { post } = useLocalSearchParams<{ post?: string }>();
  const editingPost:
    | (PostType & {
        id: string;
      })
    | null = useMemo(() => (post ? JSON.parse(post) : null), [post]);

  // use form
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PostType>({
    resolver: zodResolver(addPostSchema),
  });

  // file
  const {
    pickImage,
    takePhoto,
    file,
    progress,
    status,
    deleteFile,
    handleImage,
  } = useUpload({
    source: "post",
  });
  // handle file

  useFocusEffect(
    useCallback(() => {
      reset({
        content: editingPost?.content || undefined,
        category: editingPost?.category || undefined,
        location: editingPost?.location || undefined,
        file: editingPost?.file || undefined,
      });

      handleImage(!editingPost?.file ? null : { url: editingPost.file });
    }, [
      reset,
      editingPost?.content,
      editingPost?.category,
      editingPost?.location,
      editingPost?.file,
      handleImage,
    ])
  );

  // mutation post
  const {
    save: {
      isPending: isLoading,
      error: errorApi,
      reset: resetPost,
      mutateAsync,
    },
  } = usePostMutations();

  const handlePost: SubmitHandler<PostType> = async (data: PostType) => {
    if (file ?? editingPost?.file) {
      data = {
        ...data,
        file: file?.url ?? editingPost?.file ?? "",
      };
    }

    const res: ApiSuccess<any> = await mutateAsync({
      id: editingPost?.id,
      data,
    });
    if (res.success) {
      resetPost();
      reset();
      router.back();
      handleImage(null);
      showToast(
        t(
          editingPost
            ? "post.action.updateSuccess"
            : "post.action.createSuccess"
        )
      );
    }
  };

  // handle Image
  const handleDeleteImage = useCallback(() => {
    if (editingPost?.file === file?.url) {
      handleImage(null);
    } else {
      deleteFile(file?.url as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingPost?.file, file?.url]);
  // set navigation right icon
  const contentLength = watch("content")?.trim()?.length ?? 0;
  return {
    //form
    control,
    handleSubmit,
    errors,
    // query
    isLoading,
    errorApi,
    //upload
    pickImage,
    takePhoto,
    file,
    progress,
    status,
    handleDeleteImage,
    handlePost,
    contentLength,
    isUpdate: !!editingPost?.id,
  };
};
