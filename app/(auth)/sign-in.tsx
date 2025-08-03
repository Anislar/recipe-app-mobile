import { StyleSheet, Text, TextInput, View } from "react-native";
import { lazy, Suspense, useRef, useState } from "react";
import { Link, router } from "expo-router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store";
import {
  BackButton,
  Button,
  FormWrapper,
  LoadingSpinner,
  ScreenWrapper,
  TextInputComponent,
} from "@/components";
import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import { SignInSchema, type SignInType } from "@/helpers/auth";
import { showToast } from "@/helpers/toastService";
import { t } from "i18next";
import { useSelectedColors } from "@/store/themeStore";

const SocialButtonComponent = lazy(() =>
  import("@/components/auth").then((el) => ({
    default: el.SocialButtonComponent,
  }))
);

const SignInScreen = () => {
  const selected = useSelectedColors();

  const { signIn, error: errorAPI, isLoading } = useAuthStore();
  const passwordRef = useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(true);
  const { control, handleSubmit, watch } = useForm<SignInType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin: SubmitHandler<SignInType> = async (data: SignInType) => {
    const response = await signIn(data);
    if (typeof response === "string" && response === "EMAIL_NOT_VERIFIED") {
      const email = watch("email");

      router.push({
        pathname: "/(auth)/verify-code",
        params: {
          email,
          path: "verify-email",
        },
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
            <Text style={styles.welcomeText}>{t("auth.signIn.welcome")} </Text>
            <Text style={styles.welcomeText}>
              {t("auth.signIn.welcomeBack")}{" "}
            </Text>
          </View>
          {/* form */}
          <View style={styles.form}>
            <Text style={styles.form_description}>
              {t("auth.signIn.description")}
            </Text>
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
                    enterKeyHint="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    value={value}
                    placeholder={t("auth.enterEmail")}
                    onChangeText={onChange}
                    onBlur={onBlur}
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
                    ref={passwordRef}
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

            <Link href="/(auth)/password/forgot" push>
              <Text
                style={[styles.forgotPassword, { color: selected.primaryDark }]}
              >
                {t("auth.signIn.forgotPassword")}
              </Text>
            </Link>
            {/* Button */}
            <Button
              title={t("auth.signIn.signIn")}
              loading={isLoading}
              onPress={handleSubmit(handleLogin)}
            />
            {errorAPI?.message && (
              <Text style={styles.errorText}>
                {t("common.error")} : {errorAPI.message}{" "}
              </Text>
            )}
            {/* Footer */}

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t("auth.signIn.dontHaveAccount")}
              </Text>
              <Link href="/(auth)/sign-up" push>
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
                  {t("auth.signIn.signUp")}
                </Text>
              </Link>
            </View>
          </View>

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
  forgotPassword: {
    textAlign: "right",
    fontWeight: THEME.fonts.semibold,
    textDecorationLine: "underline",
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
export default SignInScreen;
