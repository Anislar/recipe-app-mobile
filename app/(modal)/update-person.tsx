import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useRef } from "react";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  ScreenWrapper,
  Avatar,
  FormWrapper,
  TextInputComponent,
  LoadingSpinner,
} from "@/components";

import { hp, wp } from "@/helpers/common";

import { THEME } from "@/constants/theme";
import { useAuthStore } from "@/store";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { updateUserSchema, UpdateUserType } from "@/helpers/user";
import { showToast } from "@/helpers/toastService";
import useUpload from "@/hooks/useUpload";
const UpdatePerson = () => {
  const { isLoading, user, updateProfile } = useAuthStore();
  const { control, handleSubmit } = useForm<UpdateUserType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name ?? "",
      bio: user?.bio ?? "",
      location: user?.location ?? "",
      phone: user?.phone ?? "",
      avatar: user?.avatar ?? "",
    },
  });
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
  const { pickImage, uploading, progress } = useUpload({
    source: "post",
  });

  const onSubmit: SubmitHandler<UpdateUserType> = async (
    data: UpdateUserType
  ) => {
    const response = await updateProfile(data);
    if (typeof response === "boolean") {
      router.back();
      showToast("Profile update successfully!");
    }
  };
  return (
    <ScreenWrapper bg="white">
      <FormWrapper>
        <View style={styles.container}>
          {uploading ? (
            <View
              style={{
                gap: 5,
              }}
            >
              <LoadingSpinner />
              <Text style={styles.progressText}> {progress}% </Text>
            </View>
          ) : (
            <View style={styles.avatarContainer}>
              <Avatar
                uri={user?.avatar!}
                size={hp(13)}
                rounded={THEME.radius.xxl * 1.4}
              />
              <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                <Feather name="camera" size={24} color={THEME.colors.text} />
              </TouchableOpacity>
            </View>
          )}

          {/* field info */}
          <View
            style={{
              marginTop: hp(3),
              flex: 1,
              gap: wp(6),
            }}
          >
            <Text style={styles.label}>Account settings</Text>

            <Controller
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    containerStyles={
                      error && {
                        borderColor: THEME.colors.rose,
                      }
                    }
                    value={value}
                    autoCapitalize="words"
                    onBlur={onBlur}
                    icon="user"
                    placeholder="Enter your name"
                    onChangeText={onChange}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      inputRefs[0].current?.focus();
                    }}
                  />
                  {error && (
                    <Text style={{ color: THEME.colors.rose }}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
              name="name"
            />

            <Controller
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    ref={inputRefs?.[0]}
                    containerStyles={
                      error && {
                        borderColor: THEME.colors.rose,
                      }
                    }
                    value={value}
                    onBlur={onBlur}
                    icon="phone"
                    placeholder="Enter your phone"
                    onChangeText={onChange}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      inputRefs[1].current?.focus();
                    }}
                  />
                  {error && (
                    <Text style={{ color: THEME.colors.rose }}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
              name="phone"
            />

            <Controller
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    ref={inputRefs[1]}
                    containerStyles={
                      error && {
                        borderColor: THEME.colors.rose,
                      }
                    }
                    value={value}
                    onBlur={onBlur}
                    icon="map-pin"
                    autoCapitalize="words"
                    placeholder="Enter your phone"
                    onChangeText={onChange}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      inputRefs[2].current?.focus();
                    }}
                  />
                  {error && (
                    <Text style={{ color: THEME.colors.rose }}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
              name="location"
            />

            <Controller
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    ref={inputRefs?.[2]}
                    containerStyles={{
                      borderColor: error
                        ? THEME.colors.rose
                        : THEME.colors.text,
                      height: hp(13),
                    }}
                    multiline
                    value={value}
                    onBlur={onBlur}
                    icon="info"
                    autoCapitalize="words"
                    placeholder="Enter your phone"
                    onChangeText={onChange}
                  />
                  {error && (
                    <Text style={{ color: THEME.colors.rose }}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
              name="bio"
            />
            <View
              style={{
                marginTop: 20,
              }}
            >
              <Button
                title="Submit"
                loading={isLoading}
                hasShadow
                buttonStyle={{
                  height: hp(6),
                  marginHorizontal: wp(5),
                  gap: wp(1),
                }}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        </View>
      </FormWrapper>
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: wp(3), gap: hp(2) },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
    marginBottom: hp(2),
  },
  editIcon: {
    position: "absolute",
    bottom: -20,
    right: -20,
    padding: 7,
    borderRadius: 50,
    elevation: 7,
    shadowColor: THEME.colors.textDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    backgroundColor: "white",
  },
  progressText: {
    fontSize: hp(3),
    fontWeight: THEME.fonts.medium,
    color: THEME.colors.textDark,
  },
  label: {
    fontSize: hp(1.7),
    fontWeight: THEME.fonts.medium,
    color: THEME.colors.textLight,
  },
});
export default UpdatePerson;
