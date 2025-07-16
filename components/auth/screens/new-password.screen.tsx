import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BackButton,
  Button,
  FormWrapper,
  ScreenWrapper,
  TextInputComponent,
} from "@/components";
import { THEME } from "@/constants/colors";
import { hp, wp } from "@/helpers/common";
import { useRef, useState } from "react";
import { useAuthStore } from "@/store";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { resetPasswordSchema, ResetPasswordType } from "@/helpers/schema";
import { useLocalSearchParams, useRouter } from "expo-router";
import { showToast } from "@/helpers/toastService";

const NewPasswordScreen = () => {
  const router = useRouter();
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
    showToast("Password has been reset succesfully!");

    if (response) {
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
            <Text style={styles.welcomeText}>Let&apos;s,</Text>
            <Text style={styles.welcomeText}>Create a new Password</Text>
          </View>
          {/* form */}
          <View style={styles.form}>
            <Text style={styles.form_description}>
              Your password must at least have 8 caracters.
            </Text>
            <Controller
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    ref={inputRef}
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

            <Controller
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInputComponent
                    ref={inputRef}
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
                    placeholder="Enter your confirm password"
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
                Error : {errors.email.message}
              </Text>
            )}
            {errors.password && (
              <Text style={styles.errorText}>
                Error : {errors.password.message}
              </Text>
            )}

            {/* Button */}
            <Button
              title="Reset Password"
              loading={isLoading}
              onPress={handleSubmit(onSubmit)}
            />
            {errorAPI?.message && (
              <Text style={styles.errorText}>Error : {errorAPI.message} </Text>
            )}
            {/* Footer */}
          </View>
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
    fontSize: hp(1.7),
    fontWeight: THEME.fonts.medium,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.gray,
  },
});
export default NewPasswordScreen;
