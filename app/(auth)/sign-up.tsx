import { StyleSheet, Text, TextInput, View } from "react-native";
import { useRef, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";

import { useAuthStore } from "@/store";
import { THEME } from "@/constants/colors";
import {
  BackButton,
  Button,
  FormWrapper,
  ScreenWrapper,
  SocialButtonComponent,
  TextInputComponent,
} from "@/components";
import { hp, wp } from "@/helpers/common";
import { signUpSchema, type SignUpType } from "@/helpers/schema";
import { useClearAuthErrorOnFocus } from "@/hooks/useClearError";

const SignUp = () => {
  useClearAuthErrorOnFocus();
  const { register, error: errorAPI, isLoading } = useAuthStore();
  const inputRefs = [useRef<TextInput>(null), useRef<TextInput>(null)];
  const [showPassword, setShowPassword] = useState(true);

  const { control, handleSubmit } = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });
  // Handle error display in useEffect to avoid setState during render

  const handleRegister: SubmitHandler<SignUpType> = (data: SignUpType) => {
    register(data);
  };
  return (
    <ScreenWrapper bg="white">
      <FormWrapper>
        <View style={styles.container}>
          <BackButton size={26} />
          {/* Welcome text */}
          <View>
            <Text style={styles.welcomeText}>Let&apos;s,</Text>
            <Text style={styles.welcomeText}>Get Started!</Text>
          </View>
          {/* form */}
          <View style={styles.form}>
            <Text style={styles.form_description}>
              Please Fill the details to create an account
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
                    value={value}
                    icon="person-outline"
                    placeholder="Enter your name"
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
                    ref={inputRefs[0]}
                    containerStyles={
                      error && {
                        borderColor: THEME.colors.rose,
                      }
                    }
                    value={value}
                    icon="mail-outline"
                    placeholder="Enter your email"
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
                    ref={inputRefs[1]}
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
              title="Sign Up"
              loading={isLoading}
              onPress={handleSubmit(handleRegister)}
            />
            {errorAPI?.message && (
              <Text style={styles.errorText}>Error : {errorAPI.message} </Text>
            )}
            <View style={styles.footer}>
              <Text style={styles.footerText}>already have an accout?</Text>
              <Link href="/(auth)/sign-in" push>
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
                  Sign In
                </Text>
              </Link>
            </View>
          </View>

          {/* Footer */}

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
export default SignUp;
