import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BackButton,
  Button,
  FormWrapper,
  ScreenWrapper,
  TextInputComponent,
} from "@/components";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { useRef, useState } from "react";
import { useAuthStore } from "@/store";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { resetPasswordSchema, ResetPasswordType } from "@/helpers/auth";
import { useLocalSearchParams, router } from "expo-router";
import { showToast } from "@/helpers/toastService";
import { useTranslation } from "react-i18next";

const NewPasswordScreen = () => {
  const { t } = useTranslation();

  const { email } = useLocalSearchParams();

  const inputRef = useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email as string,
      password: "",
      confirmPassword: "",
    },
  });

  const { resetPassword, error: errorAPI, isLoading } = useAuthStore();
  const onSubmit: SubmitHandler<ResetPasswordType> = async (
    data: ResetPasswordType
  ) => {
    const response = await resetPassword(data);

    if (typeof response === "boolean") {
      showToast(t("auth.newPassword.success"));
      router.push("/sign-in");
    }
  };
  return (
    <ScreenWrapper bg="white">
      <FormWrapper>
        <View style={styles.container}>
          <BackButton size={26} />
          {/* Welcome text */}
          <View>
            <Text style={styles.welcomeText}>{t("auth.newPassword.lets")}</Text>
            <Text style={styles.welcomeText}>
              {t("auth.newPassword.createNewPassword")}
            </Text>
          </View>
          {/* form */}
          <View style={styles.form}>
            <Text style={styles.form_description}>
              {t("auth.newPassword.description")}
            </Text>
            <Controller
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    label={t("auth.password")}
                    ref={inputRef}
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
                    ref={inputRef}
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
  welcomeText: {
    fontSize: hp(4),
    fontWeight: THEME.fonts.bold,
    color: THEME.colors.text,
  },
  form: {
    gap: 15,
  },
  form_description: {
    fontSize: hp(1.5),
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
