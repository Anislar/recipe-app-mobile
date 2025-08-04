import { StyleSheet, Text, TextInput, View } from "react-native";
import { lazy, Suspense, useRef, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";

import { useAuthStore, useSelectedColors } from "@/store";
import { THEME } from "@/constants/theme";
import {
  BackButton,
  Button,
  FormWrapper,
  LoadingSpinner,
  ScreenWrapper,
  TextInputComponent,
} from "@/components";
import { hp, wp } from "@/helpers/common";
import { signUpSchema, type SignUpType } from "@/helpers/auth";
import { showToast } from "@/helpers/toastService";
import { useClear } from "@/hooks/useClearError";
import { useTranslation } from "react-i18next";

const SocialButtonComponent = lazy(() =>
  import("@/components/auth").then((el) => ({
    default: el.SocialButtonComponent,
  }))
);
const SignUpScreen = () => {
  const { t } = useTranslation();
  useClear();
  const selected = useSelectedColors();

  const { signUp, error: errorAPI, isLoading } = useAuthStore();
  const inputRefs = [useRef<TextInput>(null), useRef<TextInput>(null)];
  const [showPassword, setShowPassword] = useState(true);

  const { control, handleSubmit, watch } = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });
  // Handle error display in useEffect to avoid setState during render

  const handleRegister: SubmitHandler<SignUpType> = async (
    data: SignUpType
  ) => {
    const response = await signUp(data);
    const email = watch("email");
    if (typeof response === "boolean") {
      router.push({
        pathname: "/(auth)/verify-code",
        params: { email, path: "verify-email" },
      });
      showToast(t("auth.signIn.emailNotVerified"));
    }
  };

  return (
    <ScreenWrapper bg="white">
      <FormWrapper>
        <View style={styles.container}>
          <BackButton size={26} />
          {/* Welcome text */}
          <View>
            <Text style={styles.welcomeText}>{t("auth.signUp.lets")} </Text>
            <Text style={styles.welcomeText}>
              {t("auth.signUp.getStarted")}{" "}
            </Text>
          </View>
          {/* form */}
          <View style={styles.form}>
            <Text style={styles.form_description}>
              {t("auth.signUp.description")}
            </Text>
            <Controller
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    label={t("common.name")}
                    containerStyles={
                      error && {
                        borderColor: THEME.colors.rose,
                      }
                    }
                    value={value}
                    placeholder={t("auth.enterName")}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={() => inputRefs[0].current?.focus()}
                    enterKeyHint="next"
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
                    label={t("common.email")}
                    ref={inputRefs[0]}
                    containerStyles={
                      error && {
                        borderColor: THEME.colors.rose,
                      }
                    }
                    keyboardType="email-address"
                    value={value}
                    placeholder={t("auth.enterEmail")}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={() => inputRefs[1].current?.focus()}
                    enterKeyHint="next"
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

            <Controller
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    label={t("auth.password")}
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
                    placeholder={t("auth.enterPassword")}
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
              name="password"
            />

            {/* Button */}
            <Button
              title={t("auth.signUp.signUp")}
              loading={isLoading}
              onPress={handleSubmit(handleRegister)}
            />
            {errorAPI?.message && (
              <Text style={styles.errorText}>
                {t("common.error")} {errorAPI.message}
              </Text>
            )}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t("auth.signUp.alreadyHaveAccount")}{" "}
              </Text>
              <Link href="/(auth)/sign-in" push prefetch>
                <Text
                  style={[
                    styles.footerText,
                    {
                      color: selected.primaryDark,
                      fontWeight: THEME.fonts.semibold,
                      textDecorationLine: "underline",
                    },
                  ]}
                >
                  {t("auth.signUp.signIn")}
                </Text>
              </Link>
            </View>
          </View>

          {/* Footer */}

          {/* Social Media */}
          <Suspense
            fallback={<LoadingSpinner color={THEME.colors.text} size="small" />}
          >
            <SocialButtonComponent />
          </Suspense>
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
  footerText: {
    textAlign: "center",
    color: THEME.colors.text,
    fontSize: hp(1.6),
  },
  errorText: {
    color: THEME.colors.rose,
    fontSize: hp(1.5),
    fontWeight: THEME.fonts.medium,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.gray,
  },
});
export default SignUpScreen;
