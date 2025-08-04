import { useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import {
  Button,
  FormWrapper,
  ScreenWrapper,
  TextInputComponent,
} from "@/components";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { useAuthStore } from "@/store";
import { resetPasswordSchema, ResetPasswordType } from "@/helpers/auth";
import { showToast } from "@/helpers/toastService";
import { router } from "expo-router";

const NewPasswordScreen = () => {
  const { t } = useTranslation();

  const user = useAuthStore((s) => s.user);
  const inputRefs = [useRef<TextInput>(null), useRef<TextInput>(null)];
  const [showPassword, setShowPassword] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: user?.email as string,
      password: "",
      confirmPassword: "",
      currentPassword: "",
    },
  });

  const { resetPassword, error: errorAPI, isLoading } = useAuthStore();
  const onSubmit: SubmitHandler<ResetPasswordType> = async (
    data: ResetPasswordType
  ) => {
    const response = await resetPassword(data);

    if (typeof response === "boolean") {
      showToast(t("auth.newPassword.success"));
      reset();
      router.back();
    }
  };
  return (
    <ScreenWrapper bg="white">
      <FormWrapper>
        <View style={styles.container}>
          {/* form */}
          <View style={styles.form}>
            <Text style={styles.form_description}>
              {t("auth.newPassword.description")}
            </Text>
            {!user?.provider && (
              <Controller
                control={control}
                render={({
                  field: { onBlur, onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <TextInputComponent
                      label={t("auth.newPassword.currentPassword")}
                      containerStyles={
                        error && {
                          borderColor: THEME.colors.rose,
                        }
                      }
                      value={value}
                      onBlur={onBlur}
                      onSubmitEditing={() => inputRefs[0].current?.focus()}
                      enterKeyHint="next"
                      suffixIcon={!showPassword ? "eye" : "eye-off"}
                      onPressIcon={() => setShowPassword((prev) => !prev)}
                      secureTextEntry={showPassword}
                      placeholder={t("auth.newPassword.enterCurrentPassword")}
                      onChangeText={onChange}
                    />
                    {error && (
                      <Text style={{ color: THEME.colors.rose }}>
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
                name="currentPassword"
              />
            )}
            <Controller
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    label={t("auth.password")}
                    ref={inputRefs[0]}
                    containerStyles={
                      error && {
                        borderColor: THEME.colors.rose,
                      }
                    }
                    value={value}
                    onBlur={onBlur}
                    suffixIcon={!showPassword ? "eye" : "eye-off"}
                    onPressIcon={() => setShowPassword((prev) => !prev)}
                    secureTextEntry={showPassword}
                    placeholder={t("auth.enterPassword")}
                    onChangeText={onChange}
                    enterKeyHint="next"
                    onSubmitEditing={() => inputRefs[1].current?.focus()}
                  />
                  {error && (
                    <Text style={{ color: THEME.colors.rose }}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
              name="password"
            />

            <Controller
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    label={t("auth.newPassword.confirmPassword")}
                    ref={inputRefs[1]}
                    containerStyles={
                      error && {
                        borderColor: THEME.colors.rose,
                      }
                    }
                    value={value}
                    onBlur={onBlur}
                    suffixIcon={!showPassword ? "eye" : "eye-off"}
                    onPressIcon={() => setShowPassword((prev) => !prev)}
                    secureTextEntry={showPassword}
                    placeholder={t("auth.newPassword.enterConfirmPassword")}
                    onChangeText={onChange}
                    enterKeyHint="done"
                  />
                  {error && (
                    <Text style={{ color: THEME.colors.rose }}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
              name="confirmPassword"
            />
            {errors.email && (
              <Text style={styles.errorText}>
                {t("common.error")} : {errors.email.message}
              </Text>
            )}
            {errors.password && (
              <Text style={styles.errorText}>
                {t("common.error")} : {errors.password.message}
              </Text>
            )}

            {/* Button */}

            <Button
              buttonStyle={{
                marginTop: hp(2),
              }}
              title={t("auth.newPassword.resetPassword")}
              loading={isLoading}
              onPress={handleSubmit(onSubmit)}
            />
            {errorAPI?.message && (
              <Text style={styles.errorText}>
                {t("common.error")} : {errorAPI.message}{" "}
              </Text>
            )}
          </View>
        </View>
      </FormWrapper>
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: hp(3.5),
    paddingHorizontal: wp(5),
  },

  form: {
    gap: hp(2),
  },
  form_description: {
    fontSize: hp(1.6),
    color: THEME.colors.text,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  errorText: {
    color: THEME.colors.rose,
    fontSize: hp(1.7),
    fontWeight: THEME.fonts.medium,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.gray,
  },
});
export default NewPasswordScreen;
