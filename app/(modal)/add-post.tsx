import { lazy, Suspense, useLayoutEffect, useRef } from "react";

import {
  Avatar,
  Button,
  LoadingSpinner,
  ScreenWrapper,
  Separator,
  TextInputComponent,
} from "@/components";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { addPostSchema, AddPostType } from "@/helpers/post";
import { categories } from "@/helpers/post/utils";
import { showToast } from "@/helpers/toastService";
import useUpload from "@/hooks/useUpload";
import { useAuthStore } from "@/store";
import { usePostStore } from "@/store/post.store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { router, useNavigation } from "expo-router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BottomSheetComponent = lazy(() =>
  import("@/components").then((el) => ({ default: el.BottomSheetComponent }))
);
const SelectLocation = lazy(() =>
  import("@/components").then((el) => ({ default: el.SelectLocation }))
);
const AddPost = () => {
  const user = useAuthStore((state) => state.user);
  const { addPost, isLoading, error: errorApi } = usePostStore();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddPostType>({
    resolver: zodResolver(addPostSchema),
  });
  const locationRef = useRef<any>(null);
  const { t } = useTranslation();
  const { pickImage, takePhoto, file, progress, status, deleteFile } =
    useUpload({
      source: "post",
    });
  const handlePost: SubmitHandler<AddPostType> = async (data: AddPostType) => {
    const response = await addPost(data);
    if (typeof response === "boolean") {
      router.back();
      showToast(t("post.createSuccess"));
    }
  };
  const navigation = useNavigation();
  const content = watch("content");
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          hasShadow
          title={t("post.post")}
          onPress={handleSubmit(handlePost)}
          disabled={!content?.length}
          loading={isLoading}
          buttonStyle={styles.post}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content?.length, isLoading, navigation, t]);

  return (
    <ScreenWrapper bg="white">
      <ScrollView style={styles.content}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <Avatar
            uri={user?.avatar!}
            size={hp(6)}
            rounded={THEME.radius.xxl * 2}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name} </Text>
            <Text style={styles.userEmail}>{user?.email} </Text>
          </View>
        </View>
        {/* Category Selection */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categorySelection}
        >
          <Controller
            name="category"
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                {categories.slice(1).map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categorySelectItem,
                      value === category.id && {
                        backgroundColor: category.color,
                        borderColor: category.color,
                      },
                    ]}
                    onPress={() => onChange(category.id)}
                  >
                    <Ionicons
                      name={category.icon}
                      size={18}
                      color={value === category.id ? "#ffffff" : category.color}
                    />
                    <Text
                      style={[
                        styles.categorySelectText,
                        value === category.id && { color: "#ffffff" },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                {error && (
                  <Text style={styles.errorText}>
                    {t("common.error") + ":" + error.message}
                  </Text>
                )}
              </>
            )}
          />
        </ScrollView>
        <Separator />
        {/* Content Input */}
        <Controller
          name="content"
          control={control}
          render={({
            field: { value, onBlur, onChange },
            fieldState: { error },
          }) => (
            <>
              <TextInputComponent
                containerStyles={styles.contentInput}
                placeholder={t("post.content.placeholder")}
                placeholderTextColor={THEME.colors.gray}
                multiline
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                maxLength={280}
                scrollEnabled={false}
              />

              <Text style={styles.characterCount}>
                {value?.length ?? 0}/280
              </Text>
              {error && (
                <Text style={styles.errorText}>
                  {t("common.error") + ":" + error.message}
                </Text>
              )}
            </>
          )}
        />
        {/* Media Options */}
        <Separator />
        {errorApi && (
          <Text style={styles.errorText}>
            {t("common.error") + ":" + errorApi?.message}
          </Text>
        )}
        <View style={styles.mediaOptions}>
          <TouchableOpacity style={styles.mediaOption} onPress={pickImage}>
            <Ionicons name="image-outline" size={20} color="#3b82f6" />
            <Text style={styles.mediaOptionText}>{t("post.file.image")} </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mediaOption} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={20} color="#3b82f6" />
            <Text style={styles.mediaOptionText}>{t("post.file.camera")} </Text>
          </TouchableOpacity>

          <Controller
            name="location"
            control={control}
            render={({ field: { value }, fieldState: { error } }) => (
              <View style={styles.locationContainer}>
                <TouchableOpacity
                  style={styles.mediaOption}
                  onPress={() => locationRef.current?.expand()}
                >
                  <Ionicons name="location-outline" size={20} color="#3b82f6" />
                  <Text style={styles.location}>
                    {value ?? t("post.location.placeholderMin")}
                  </Text>
                </TouchableOpacity>

                {error && (
                  <Text style={styles.errorText}>
                    {t("common.error") + ":" + error.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        {(status === "error" || errors["file"]?.message) && (
          <Text style={styles.errorText}>🚨 {t("common.errorImage")}</Text>
        )}
        {status === "uploading" && (
          <View style={styles.progressContainer}>
            <LoadingSpinner />
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}
        {file && (
          <View style={styles.imagePreview}>
            <Image
              source={{ uri: file.url as string }}
              transition={100}
              contentFit="contain"
              style={styles.previewImage}
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => deleteFile(file.url)}
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <Suspense fallback={<LoadingSpinner />}>
        <BottomSheetComponent snapPoints={["40%"]} ref={locationRef}>
          <SelectLocation
            control={control}
            close={() => {
              setTimeout(() => {
                locationRef.current?.close();
              }, 300);
            }}
          />
        </BottomSheetComponent>
      </Suspense>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  post: {
    paddingHorizontal: wp(4),
    paddingVertical: wp(1),
    height: hp(4),
  },
  // user info
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(5),
    marginBottom: hp(1.5),
    gap: wp(2),
  },
  userDetails: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  userName: {
    fontSize: hp(2),
    fontWeight: THEME.fonts.semibold,
    color: THEME.colors.text,
  },
  userEmail: {
    fontSize: hp(1.5),
    color: THEME.colors.grey2,
    marginTop: 2,
  },
  // category
  categorySelection: {
    marginHorizontal: wp(2),
    flex: 1,
  },
  categorySelectItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categorySelectText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },

  // content
  contentInput: {
    marginHorizontal: wp(2),
    fontSize: hp(1.4),
    lineHeight: 24,
    borderWidth: 0,
    color: "#374151",
    height: "auto",
    maxHeight: hp(40),
    justifyContent: "flex-start",
    padding: wp(1.5),
  },
  characterCount: {
    textAlign: "right",
    marginHorizontal: 20,
    fontSize: hp(1.4),
    color: THEME.colors.grey2,
    marginBottom: hp(2),
  },
  // action
  mediaOptions: {
    flexDirection: "row",
    paddingHorizontal: wp(5),
    gap: wp(5),
  },
  mediaOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  mediaOptionText: {
    fontSize: hp(1.6),
    fontWeight: THEME.fonts.medium,
  },
  // file
  imagePreview: {
    marginHorizontal: 20,
    marginTop: 12,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: hp(25),
    borderRadius: THEME.radius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: THEME.colors.gray,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: THEME.radius.xl,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: THEME.colors.rose,
    fontSize: hp(1.5),
    fontWeight: THEME.fonts.medium,
  },
  progressContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    height: hp(25),
    marginTop: hp(2),
    borderRadius: THEME.radius.xl,
    borderWidth: 2,
    borderColor: THEME.colors.grayLight,
    backgroundColor: THEME.colors.grayLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressText: {
    marginTop: 12,
    fontSize: hp(2),
    fontWeight: THEME.fonts.medium,
    color: THEME.colors.text,
  },
  locationContainer: {
    flexDirection: "row",
    gap: wp(1),
    alignItems: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
  },
  location: {
    fontSize: hp(1.6),
    color: THEME.colors.text,
    fontWeight: THEME.fonts.medium,
  },
});

export default AddPost;
