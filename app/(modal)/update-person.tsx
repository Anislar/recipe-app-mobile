import { View, Text, StyleSheet, TextInput } from "react-native";
import { router } from "expo-router";
import { useRef } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { IDropdownRef } from "react-native-element-dropdown";

import {
  Button,
  ScreenWrapper,
  Avatar,
  FormWrapper,
  TextInputComponent,
  LoadingSpinner,
  Separator,
  DropdownComponent,
} from "@/components";
import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import { useAuthStore } from "@/store";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { updateUserSchema, UpdateUserType } from "@/helpers/user";
import { showToast } from "@/helpers/toastService";
import useUpload from "@/hooks/useUpload";
const data = [
  { label: "Male", value: "male", icon: "male" },
  { label: "Female", value: "female", icon: "female" },
];
const UpdatePerson = () => {
  const { isLoading, user, updateProfile } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || undefined,
      bio: user?.bio || undefined,
      location: user?.location || undefined,
      phone: user?.phone || undefined,
      avatar: user?.avatar || undefined,
      gender: (user?.gender as "male" | "female") || "male",
    },
  });

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
  const dropdownRef = useRef<IDropdownRef>(null);
  const { pickImage, status, progress, file } = useUpload({ source: "post" });

  const onSubmit: SubmitHandler<UpdateUserType> = async (data) => {
    const avatar = file?.url || user?.avatar!;
    const payload = { ...data };
    if (avatar) {
      payload.avatar = avatar;
    }
    const response = await updateProfile(payload);

    if (typeof response === "boolean") {
      router.back();
      showToast("✅ Profile updated successfully!");
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
            <View style={styles.statusContainer}>
              <Text
                style={{
                  color: THEME.colors.text,
                }}
              >
                Status:
              </Text>
              <View
                style={[
                  styles.status,
                  {
                    backgroundColor: user?.isActive ? "green" : "red",
                  },
                ]}
              />
            </View>
          </View>

          {(status === "error" || errors["avatar"]?.message) && (
            <Text style={styles.errorText}>
              🚨 Error: Failed to upload file...
            </Text>
          )}
          <Separator my={hp(2)} />
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
                    label="full name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter your full name"
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
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View
                    style={{
                      width: "50%",
                    }}
                  >
                    <TextInputComponent
                      ref={inputRefs[0]}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Location"
                      label="location"
                      autoCapitalize="words"
                      returnKeyType="next"
                      containerStyles={{
                        height: hp(8),
                        borderColor: error ? THEME.colors.rose : undefined,
                      }}
                      onSubmitEditing={() => dropdownRef.current?.open()}
                    />
                    {error && (
                      <Text style={styles.errorText}>{error.message}</Text>
                    )}
                  </View>
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
                      width: "50%",
                    }}
                  >
                    <DropdownComponent
                      label="Gender"
                      ref={dropdownRef}
                      style={{
                        borderColor: error ? THEME.colors.rose : undefined,
                      }}
                      labelField="label"
                      valueField="value"
                      value={value}
                      onBlur={onBlur}
                      data={data}
                      onChange={(item) => {
                        onChange(item.value);
                        inputRefs[2].current?.focus();
                      }}
                    />

                    {error && (
                      <Text style={styles.errorText}>{error.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>

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
                    ref={inputRefs[2]}
                    label="phone"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    containerStyles={
                      error && { borderColor: THEME.colors.rose }
                    }
                    onSubmitEditing={() => inputRefs[3].current?.focus()}
                  />
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </>
              )}
            />

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
                    ref={inputRefs[3]}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Tell us a bit about yourself..."
                    label="bio"
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
          <View style={{ marginTop: 20 }}>
            <Button
              title="Save"
              loading={isLoading}
              hasShadow
              buttonStyle={{
                height: hp(6),
                borderRadius: THEME.radius.xl,
              }}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </FormWrapper>
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
  name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  statusContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    marginBottom: 10,
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
