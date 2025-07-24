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

  const { pickImage, status, progress, file } = useUpload({ source: "post" });

  const onSubmit: SubmitHandler<UpdateUserType> = async (data) => {
    const avatar = file?.url || user?.avatar!;
    const response = await updateProfile({ ...data, avatar });

    if (typeof response === "boolean") {
      router.back();
      showToast("✅ Profile updated successfully!");
    }
  };

  return (
    <ScreenWrapper bg="white">
      <FormWrapper>
        <View style={styles.container}>
          {status === "uploading" ? (
            <View style={styles.progressContainer}>
              <LoadingSpinner />
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
          ) : (
            <View style={styles.avatarWrapper}>
              <Avatar
                uri={file?.url || user?.avatar!}
                size={hp(13)}
                rounded={THEME.radius.xxl * 1.4}
              />
              <TouchableOpacity
                style={styles.editIcon}
                onPress={pickImage}
                accessibilityLabel="Change profile photo"
              >
                <Feather name="camera" size={20} color={THEME.colors.text} />
              </TouchableOpacity>
            </View>
          )}

          {status === "error" && (
            <Text style={styles.errorText}>
              🚨 Error: Failed to upload file...
            </Text>
          )}

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Account Info</Text>

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
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter your full name"
                    icon="user"
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
                    ref={inputRefs[0]}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter your phone number"
                    icon="phone"
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    containerStyles={
                      error && { borderColor: THEME.colors.rose }
                    }
                    onSubmitEditing={() => inputRefs[1].current?.focus()}
                  />
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </>
              )}
            />

            {/* Location */}
            <Controller
              control={control}
              name="location"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    ref={inputRefs[1]}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter your location"
                    icon="map-pin"
                    autoCapitalize="words"
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
                    ref={inputRefs[2]}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Tell us a bit about yourself..."
                    icon="info"
                    multiline
                    containerStyles={{
                      height: hp(13),
                      borderColor: error
                        ? THEME.colors.rose
                        : THEME.colors.textLight,
                      alignItems: "flex-start",
                      flexDirection: "row",
                    }}
                    inputStyles={{
                      textAlignVertical: "top",
                      lineHeight: hp(2.3),
                      fontSize: hp(1.4),
                      paddingTop: hp(1),
                      paddingRight: wp(10),
                    }}
                    iconStyle={{
                      marginTop: hp(1),
                      paddingLeft: wp(10),
                      alignSelf: "flex-start",
                    }}
                  />
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </>
              )}
            />

            <View style={{ marginTop: 20 }}>
              <Button
                title="Submit"
                loading={isLoading}
                hasShadow
                buttonStyle={{
                  height: hp(6),
                  marginHorizontal: wp(5),
                  borderRadius: THEME.radius.xl,
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
  container: {
    flex: 1,
    marginHorizontal: wp(3),
  },
  avatarWrapper: {
    alignSelf: "center",
    marginBottom: hp(2),
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    transform: [{ translateX: 8 }, { translateY: 8 }],
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
    borderRadius: THEME.radius.xxl * 1.4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.text,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: hp(2),
  },
  progressText: {
    marginTop: 12,
    fontSize: hp(2),
    fontWeight: "500",
    color: "#333",
  },
  formSection: {
    marginTop: hp(3),
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
});

export default UpdatePerson;
