import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { lazy, Suspense, useMemo, useRef } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { IDropdownRef } from "react-native-element-dropdown";

import {
  Avatar,
  Button,
  DropdownComponent,
  FormWrapper,
  LoadingSpinner,
  LocationSelector,
  ScreenWrapper,
  TextInputComponent,
} from "@/components";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { showToast } from "@/helpers/toastService";
import { updateUserSchema, UpdateUserType } from "@/schema/user";
import useUpload from "@/hooks/useUpload";
import { useAuthStore } from "@/store";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const BottomSheetComponent = lazy(() =>
  import("@/components").then((el) => ({ default: el.BottomSheetComponent }))
);
const SelectLocation = lazy(() =>
  import("@/components").then((el) => ({ default: el.SelectLocation }))
);
const UpdatePerson = () => {
  const { t } = useTranslation();
  const { isLoading, user, updateProfile } = useAuthStore();
  const bottomSheetRef = useRef<any>(null);
  const isUser = useMemo(() => user?.role === "user", [user?.role]);
  const data = [
    { label: t("account.updatePerson.male"), value: "male", icon: "male" },
    {
      label: t("account.updatePerson.female"),
      value: "female",
      icon: "female",
    },
  ];
  const { pickImage, status, progress, file } = useUpload({ source: "post" });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserType>({
    resolver: zodResolver(updateUserSchema),
    values: {
      avatar: file?.url,
    },
    defaultValues: {
      name: user?.name || undefined,
      bio: user?.bio || undefined,
      location: user?.location || undefined,
      phone: user?.phone || undefined,
      avatar: file?.url || user?.avatar || undefined,
      gender: (user?.gender as "male" | "female") || "male",
    },
  });

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
  const dropdownRef = useRef<IDropdownRef>(null);

  const onSubmit: SubmitHandler<UpdateUserType> = async (data) => {
    const avatar = file?.url || user?.avatar!;
    const payload = { ...data };
    if (avatar) {
      payload.avatar = avatar;
    }
    const response = await updateProfile(payload);

    if (typeof response === "boolean") {
      router.back();
      showToast(t("account.updatePerson.success"));
    }
  };

  return (
    <ScreenWrapper bg="white">
      <FormWrapper>
        <View style={styles.container}>
          <View style={styles.avatarWrapper}>
            {status === "uploading" ? (
              <View style={styles.progressContainer}>
                <LoadingSpinner />
                <Text style={styles.progressText}>{progress}%</Text>
              </View>
            ) : (
              <View>
                <Avatar
                  name={user?.name}
                  uri={file?.url || user?.avatar!}
                  size={hp(13)}
                  rounded={THEME.radius.xxl * 3}
                />
                <MaterialCommunityIcons
                  onPress={pickImage}
                  style={styles.editIcon}
                  accessibilityLabel="Change profile photo"
                  name="camera"
                  size={20}
                  color={THEME.colors.text}
                />
              </View>
            )}
            <Text style={styles.name}>{user?.name} </Text>
            <View style={styles.roleContainer}>
              <Text
                style={{
                  color: THEME.colors.text,
                }}
              >
                {t("account.updatePerson.role")}:
              </Text>
              <View style={styles.roleContainer}>
                <Text
                  style={[
                    styles.role,
                    {
                      color: isUser ? THEME.colors.text : "#20c997",
                    },
                  ]}
                >
                  {user?.role}
                </Text>
                <MaterialCommunityIcons
                  size={20}
                  color={isUser ? THEME.colors.text : "#20c997"}
                  name={isUser ? "account" : "shield-account"}
                />
              </View>
            </View>
          </View>

          {(status === "error" || errors["avatar"]?.message) && (
            <Text style={styles.errorText}>🚨 {t("common.errorImage")}</Text>
          )}
          <View style={styles.formSection}>
            {/* Name */}
            <Controller
              control={control}
              name="name"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    label={t("account.updatePerson.fullName")}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder={t("account.updatePerson.fullNamePlaceholder")}
                    returnKeyType="next"
                    autoCapitalize="words"
                    containerStyles={
                      error && { borderColor: THEME.colors.rose }
                    }
                    onSubmitEditing={() => inputRefs[0].current?.focus()}
                  />
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </>
              )}
            />
            {/* Phone */}
            <Controller
              control={control}
              name="phone"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    ref={inputRefs[1]}
                    label={t("account.updatePerson.phoneNumber")}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder={t(
                      "account.updatePerson.phoneNumberPlaceholder"
                    )}
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    containerStyles={
                      error && { borderColor: THEME.colors.rose }
                    }
                    onSubmitEditing={() => inputRefs[2].current?.focus()}
                  />
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </>
              )}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 5,
                flex: 1,
              }}
            >
              {/* Location */}
              <Controller
                control={control}
                name="location"
                render={() => (
                  <LocationSelector
                    control={control}
                    style={{
                      flexDirection: "column",
                      height: hp(9),
                      borderRadius: THEME.radius.xxl,
                    }}
                    onOpen={() => {
                      bottomSheetRef.current?.snapToIndex(0);
                    }}
                  />
                )}
              />
              {/* Gender */}
              <Controller
                control={control}
                name="gender"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View
                    style={{
                      width: "45%",
                    }}
                  >
                    <DropdownComponent
                      label={t("account.updatePerson.gender")}
                      ref={dropdownRef}
                      style={{
                        height: hp(9),
                        borderColor: error ? THEME.colors.rose : undefined,
                      }}
                      labelField="label"
                      valueField="value"
                      value={value}
                      onBlur={onBlur}
                      data={data}
                      onChange={(item) => {
                        onChange(item.value);
                        inputRefs[1].current?.focus();
                      }}
                    />

                    {error && (
                      <Text style={styles.errorText}>{error.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Bio */}
            <Controller
              control={control}
              name="bio"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    label={t("account.updatePerson.about")}
                    ref={inputRefs[2]}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder={t("account.updatePerson.aboutPlaceholder")}
                    multiline
                    containerStyles={{
                      height: hp(14),
                      borderColor: error
                        ? THEME.colors.rose
                        : THEME.colors.textLight,
                    }}
                  />
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </>
              )}
            />
          </View>
          <Button
            title={t("common.save")}
            loading={isLoading}
            hasShadow
            buttonStyle={{
              height: hp(6),
              borderRadius: THEME.radius.xl,
            }}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </FormWrapper>
      <Suspense fallback={<LoadingSpinner />}>
        <BottomSheetComponent snapPoints={["40%"]} ref={bottomSheetRef}>
          <SelectLocation
            close={() => bottomSheetRef.current.close()}
            control={control}
          />
        </BottomSheetComponent>
      </Suspense>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: wp(3),
  },
  avatarWrapper: {
    alignItems: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    transform: [{ translateX: 4 }, { translateY: 4 }],
    padding: 6,
    borderRadius: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  progressContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: hp(13),
    width: hp(13),
    borderRadius: THEME.radius.xxl * 3,
    borderWidth: 2,
    borderColor: THEME.colors.text,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  progressText: {
    marginTop: 12,
    fontSize: hp(2),
    fontWeight: "500",
    color: "#333",
  },
  formSection: {
    gap: hp(2.5),
    paddingVertical: wp(3),
  },
  sectionTitle: {
    fontSize: hp(2),
    color: THEME.colors.text,
    fontWeight: THEME.fonts.medium,
  },
  errorText: {
    fontSize: hp(1.6),
    color: THEME.colors.rose,
    marginTop: 4,
  },
  profileSection: { alignItems: "center" },
  name: { fontSize: hp(2.3), fontWeight: THEME.fonts.bold, marginTop: 10 },
  role: {
    fontSize: hp(1.8),
    fontWeight: THEME.fonts.bold,
  },
  roleContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  status: {
    height: hp(1.5),
    width: hp(1.5),
    borderRadius: hp(1),
    borderColor: "black",
    borderWidth: 1,
  },
});

export default UpdatePerson;
