import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { addPostSchema, PostType } from "@/helpers/post";
import { showToast } from "@/helpers/toastService";
import { ApiSuccess } from "@/type";
import useUpload from "../useUpload";
import { usePostMutations } from "./useMutationPost";
import { useTranslation } from "react-i18next";

export const useSetPost = () => {
  const { t } = useTranslation();
  // user hooks
  const { post } = useLocalSearchParams<{ post?: string }>();
  const editingPost:
    | (PostType & {
        id: string;
      })
    | null = post ? JSON.parse(post) : null;

  // use form
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PostType>({
    resolver: zodResolver(addPostSchema),
    defaultValues: {
      content: editingPost?.content || undefined,
      category: editingPost?.category || undefined,
      location: editingPost?.location || undefined,
      file: editingPost?.file || undefined,
    },
  });

  // file
  const { pickImage, takePhoto, file, progress, status, deleteFile, setFile } =
    useUpload({
      source: "post",
    });
  // handle file
  useEffect(() => {
    if (editingPost?.file)
      setFile({
        url: editingPost?.file,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingPost?.file]);

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
    if (file || editingPost?.file) {
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
      setFile(null);
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
  const handleDeleteImage = () => {
    if (editingPost) {
      setFile(null);
    } else deleteFile(file?.url as string);
  };
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
  };
};
