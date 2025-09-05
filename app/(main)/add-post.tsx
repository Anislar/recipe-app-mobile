import { Image } from "expo-image";
import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Avatar,
  Button,
  CategoryItem,
  HeaderTab,
  LoadingSpinner,
  ScreenWrapper,
  Separator,
  TextInputComponent,
} from "@/components";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { categories } from "@/helpers/post/utils";
import { useSetPost } from "@/hooks/post/useSetPost";
import { useAuthStore } from "@/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";

const BottomSheetComponent = lazy(() =>
  import("@/components").then((el) => ({ default: el.BottomSheetComponent }))
);
const SelectLocation = lazy(() =>
  import("@/components").then((el) => ({ default: el.SelectLocation }))
);

const AddPost = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  // bottom Ref
  const locationRef = useRef<any>(null);

  const {
    control,
    handleSubmit,
    errors,
    isUpdate,
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
  } = useSetPost();

  // add right icon
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTab
          titleStyle={{
            marginLeft: -wp(5),
          }}
          showBackButton
          title={t(isUpdate ? "modal.updatePost" : "modal.addPost")}
        />
      ),
      headerRight: () => (
        <Button
          hasShadow
          title={t("post.post")}
          onPress={handleSubmit(handlePost)}
          disabled={contentLength === 0}
          loading={isLoading}
          buttonStyle={styles.postBtn}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentLength, isUpdate, isLoading]);
  return (
    <ScreenWrapper bg="white">
      <ScrollView style={styles.content} showsVerticalScrollIndicator>
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
        <View style={styles.container}>
          <Text style={styles.label}>
            {t("post.category.placeholder")}
            {" :"}
          </Text>
          <Controller
            name="category"
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categorySelection}
                >
                  {categories.slice(1).map((category) => (
                    <CategoryItem
                      key={category.id}
                      category={category}
                      isSelected={value === category.id}
                      onPress={() => onChange(category.id)}
                    />
                  ))}
                </ScrollView>

                {error && (
                  <Text style={[styles.errorText, { marginTop: 5 }]}>
                    {t("common.error") + ":" + error?.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>
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
                label={t("post.content.label") + " :"}
                containerStyles={styles.contentInput}
                placeholder={t("post.content.placeholder")}
                placeholderTextColor={THEME.colors.gray}
                labelStyle={styles.label}
                multiline
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                maxLength={500}
                scrollEnabled={false}
              />

              <Text style={styles.characterCount}>
                {value?.length ?? 0}/500
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
        <Separator my={hp(2)} />

        <View style={styles.container}>
          {errorApi && (
            <Text style={[styles.errorText, { fontSize: hp(2) }]}>
              {t("common.error") + ": " + errorApi?.message}
            </Text>
          )}
          <Text style={styles.label}>
            {t("post.extra.label")}
            {" :"}
          </Text>
          <View style={styles.mediaOptions}>
            <TouchableOpacity style={styles.mediaOption} onPress={pickImage}>
              <Ionicons
                name="image-outline"
                size={20}
                color={THEME.colors.textDark}
              />
              <Text style={[styles.mediaOptionText]}>
                {t("post.file.image")}{" "}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mediaOption} onPress={takePhoto}>
              <Ionicons
                name="camera-outline"
                size={20}
                color={THEME.colors.textDark}
              />
              <Text style={[styles.mediaOptionText]}>
                {t("post.file.camera")}{" "}
              </Text>
            </TouchableOpacity>

            <Controller
              name="location"
              control={control}
              render={({ field: { value }, fieldState: { error } }) => (
                <View>
                  <TouchableOpacity
                    style={styles.mediaOption}
                    onPress={() => locationRef.current?.expand()}
                  >
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color={THEME.colors.textDark}
                    />
                    <Text style={styles.location}>
                      {value || t("post.location.placeholderMin")}
                    </Text>
                  </TouchableOpacity>

                  {error && (
                    <Text style={styles.errorText}>
                      {t("common.error") + ":" + error?.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
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
              source={{
                uri: file.url as string,
              }}
              transition={100}
              contentFit="cover"
              style={styles.previewImage}
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={handleDeleteImage}
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
  postBtn: {
    marginRight: 10,
    marginTop: 3,
    paddingHorizontal: wp(2.5),
    paddingVertical: wp(1),
    height: hp(4),
    width: wp(20),
  },
  container: {
    paddingHorizontal: wp(3),
    gap: wp(1.5),
  },

  // user info
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    marginBottom: hp(1.5),
    gap: wp(2),
  },
  userDetails: {
    //  flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  userName: {
    fontSize: hp(2),
    textTransform: "capitalize",
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
    gap: wp(1.5),
  },

  label: {
    fontSize: hp(1.6),
    color: THEME.colors.darkGray,
    fontWeight: THEME.fonts.medium,
  },

  // content
  contentInput: {
    borderRadius: 0,
    marginHorizontal: wp(2),
    fontSize: hp(1.4),
    lineHeight: 24,
    borderWidth: 0,
    color: "#374151",
    height: hp(40),
    justifyContent: "flex-start",
    padding: 0,
    paddingHorizontal: wp(1),
  },
  characterCount: {
    textAlign: "right",
    marginHorizontal: 20,
    fontSize: hp(1.4),
    color: THEME.colors.grey2,
    // marginBottom: hp(2),
  },
  // action
  mediaOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: wp(1.5),
    marginTop: 5,
  },
  mediaOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  mediaOptionText: {
    fontSize: hp(1.6),
    fontWeight: THEME.fonts.medium,
    color: THEME.colors.text + "90",
  },
  // file
  imagePreview: {
    marginHorizontal: 20,
    marginVertical: hp(2),
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: hp(25),
    borderRadius: THEME.radius.xl,
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
  location: {
    fontSize: hp(1.6),
    color: THEME.colors.text + 90,
    fontWeight: THEME.fonts.medium,
  },
});

export default AddPost;
