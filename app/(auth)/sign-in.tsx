import { StyleSheet, Text, TextInput, View } from "react-native";
import { useRef, useState } from "react";
import { Link } from "expo-router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store";
import {
  BackButton,
  Button,
  FormWrapper,
  ScreenWrapper,
  SocialButtonComponent,
  TextInputComponent,
} from "@/components";
import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/colors";
import { SignInSchema, type SignInType } from "@/helpers/schema";
import { useClearAuthErrorOnFocus } from "@/hooks/useClearError";

const Login = () => {
  useClearAuthErrorOnFocus();
  const { login, error: errorAPI, isLoading } = useAuthStore();
  const passwordRef = useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(true);
  const { control, handleSubmit } = useForm<SignInType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin: SubmitHandler<SignInType> = (data: SignInType) => {
    login(data);
  };
  return (
    <ScreenWrapper bg="white">
      <FormWrapper>
        <View style={styles.container}>
          <BackButton size={26} />
          {/* Welcome text */}
          <View>
            <Text style={styles.welcomeText}>Hey,</Text>
            <Text style={styles.welcomeText}>Welcome Back</Text>
          </View>
          {/* form */}
          <View style={styles.form}>
            <Text style={styles.form_description}>
              Please login to continue
            </Text>
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
                    enterKeyHint="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    value={value}
                    icon="mail-outline"
                    placeholder="Enter your email"
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
                    ref={passwordRef}
                    containerStyles={
                      error && {
                        borderColor: THEME.colors.rose,
                      }
                    }
                    value={value}
                    onBlur={onBlur}
                    icon="lock-closed-outline"
                    suffixIcon={
                      !showPassword ? "eye-outline" : "eye-off-outline"
                    }
                    onPressIcon={() => setShowPassword((prev) => !prev)}
                    secureTextEntry={showPassword}
                    placeholder="Enter your password"
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

            <Link href="/(auth)/forgot-password" push>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </Link>
            {/* Button */}
            <Button
              title="Sign In"
              loading={isLoading}
              onPress={handleSubmit(handleLogin)}
            />
            {errorAPI?.message && (
              <Text style={styles.errorText}>Error : {errorAPI.message} </Text>
            )}
            {/* Footer */}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don&apos;t have an accout?</Text>
              <Link href="/(auth)/sign-up" push>
                <Text
                  style={[
                    styles.footerText,
                    {
                      color: THEME.colors.primaryDark,
                      fontWeight: THEME.fonts.semibold,
                      textDecorationLine: "underline",
                    },
                  ]}
                >
                  Sign Up
                </Text>
              </Link>
            </View>
          </View>

          {/* Social Media */}
          <SocialButtonComponent />
        </View>
      </FormWrapper>
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
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
    color: THEME.colors.primaryDark,
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
export default Login;
