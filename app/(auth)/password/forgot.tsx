import { View, Text, StyleSheet } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  BackButton,
  Button,
  FormWrapper,
  ScreenWrapper,
  TextInputComponent,
} from "@/components";
import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import { useAuthStore } from "@/store";
import { SendCodeType, sendCodeSchema } from "@/schema/auth";
import { showToast } from "@/helpers/toastService";

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const { error: errorAPI, isLoading, sendCode } = useAuthStore();
  const { control, handleSubmit } = useForm<SendCodeType>({
    resolver: zodResolver(sendCodeSchema),
    defaultValues: {
      email: "",
      path: "password/forgot",
    },
  });
  const onSubmit: SubmitHandler<SendCodeType> = async (data: SendCodeType) => {
    const response = await sendCode(data);
    if (typeof response === "boolean") {
      showToast(t("auth.forgotPassword.success"));
      router.push({
        pathname: "/(auth)/verify-code",
        params: { email: data.email, path: "password/forgot" },
      });
    }
  };
  return (
    <ScreenWrapper bg="white">
      <FormWrapper>
        <View style={styles.container}>
          <BackButton size={26} />
          <View>
            <Text style={styles.welcomeText}>
              {t("auth.forgotPassword.title")}{" "}
            </Text>
          </View>
          <Text style={styles.form_description}>
            {t("auth.forgotPassword.description")}
          </Text>

          <View style={styles.form}>
            <Controller
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    label={t("common.email")}
                    containerStyles={
                      error && {
                        borderColor: THEME.colors.rose,
                      }
                    }
                    keyboardType="email-address"
                    value={value}
                    onBlur={onBlur}
                    placeholder={t("auth.enterEmail")}
                    onChangeText={onChange}
                  />
                  {error && (
                    <Text style={{ color: THEME.colors.rose }}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
              name="email"
            />

            {/* Button */}
            <Button
              title={t("auth.forgotPassword.sendResetCode")}
              loading={isLoading}
              onPress={handleSubmit(onSubmit)}
            />
            {errorAPI?.message && (
              <Text style={styles.errorText}>
                {t("common.error")} {errorAPI.message}{" "}
              </Text>
            )}
            {/* Footer */}
          </View>
          {/* Welcome text */}
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
  form: { marginTop: hp(2.5), gap: hp(2.5) },
  form_description: {
    fontSize: hp(1.5),
    color: THEME.colors.text,
  },
  errorText: {
    color: THEME.colors.rose,
    fontSize: hp(1.5),
    fontWeight: THEME.fonts.medium,
  },
});
export default ForgotPasswordScreen;
