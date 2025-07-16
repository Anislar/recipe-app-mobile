import { View, Text, StyleSheet, TextInput } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import {
  BackButton,
  Button,
  FormWrapper,
  ScreenWrapper,
  TextInputComponent,
} from "@/components";
import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/colors";
import { useAuthStore } from "@/store";
import { VerifyCodeType, verifyCodeSchema } from "@/helpers/schema";
import { Fragment, useRef, useState } from "react";
import { showToast } from "@/helpers/toastService";
const VerifyCodeScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [loadingCode, setLoadingCode] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { error: errorAPI, verifyCode, forgotPassword } = useAuthStore();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<VerifyCodeType>({
    resolver: zodResolver(verifyCodeSchema),

    defaultValues: {
      email: email as string,
      token: ["", "", "", ""],
    },
  });

  const onSubmit: SubmitHandler<VerifyCodeType> = async (
    data: VerifyCodeType
  ) => {
    const response: boolean = await verifyCode(data);
    if (response) {
      showToast("Reset password now!");
      router.push({ pathname: "/(auth)/new-password", params: { email } });
    }
  };
  const resetCode = async () => {
    setLoadingCode(true);
    await forgotPassword({ email: email as string });
    reset();
    setLoadingCode(false);
  };
  return (
    <ScreenWrapper bg="white">
      <FormWrapper>
        <View style={styles.container}>
          <BackButton size={26} />
          {/* Welcome text */}
          <View>
            <Text style={styles.welcomeText}>Reset Password</Text>
          </View>
          <Text style={styles.formDescription}>
            We send you a code to verify your email!
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Fragment key={`text_input_${index}`}>
                  <Controller
                    control={control}
                    name={`token.${index}`}
                    render={({
                      field: { onBlur, onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <TextInputComponent
                          maxLength={1}
                          containerStyles={{
                            height: 50,
                            width: 50,
                            borderRadius: THEME.radius.sm,
                            paddingHorizontal: 8,
                            gap: 0,
                            borderColor: error
                              ? THEME.colors.rose
                              : THEME.colors.text,
                          }}
                          inputStyles={{
                            textAlign: "center",
                          }}
                          value={value}
                          onBlur={onBlur}
                          placeholder="0"
                          onChangeText={(text) => {
                            onChange(text);

                            if (index === 3) {
                              handleSubmit(onSubmit)();
                            }
                            if (text && index < 3) {
                              inputRefs.current[index + 1]?.focus();
                            }
                          }}
                          onKeyPress={({ nativeEvent }) => {
                            if (
                              nativeEvent.key === "Backspace" &&
                              (!value || value.length === 0) &&
                              index > 0
                            ) {
                              setValue(`token.${index - 1}`, "");
                              inputRefs.current[index - 1]?.focus();
                            }
                          }}
                          onSubmitEditing={() => {
                            if (index === 3) {
                              handleSubmit(onSubmit)();
                            }
                            inputRefs.current?.[index + 1]?.focus();
                          }}
                          enterKeyHint="next"
                          keyboardType="numeric"
                          ref={(ref) => {
                            inputRefs.current[index] = ref;
                          }}
                        />
                      </>
                    )}
                  />
                </Fragment>
              ))}
            </View>
            {errors.email && (
              <Text style={styles.errorText}>
                Error : {errors.email.message}
              </Text>
            )}
            <Button
              buttonStyle={{
                backgroundColor: "transparent",
              }}
              textStyle={{
                color: THEME.colors.primary,
              }}
              title="resent code"
              loading={loadingCode}
              onPress={resetCode}
            />
            <Button
              title="Confirm"
              loading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
            {errorAPI?.message && (
              <Text style={styles.errorText}>Error : {errorAPI.message} </Text>
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
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: THEME.fonts.bold,
    color: THEME.colors.text,
  },
  form: { marginTop: hp(5), gap: hp(2.5) },
  inputContainer: {
    flexDirection: "row",
    gap: hp(2.5),
    justifyContent: "center",
  },
  formDescription: {
    fontSize: hp(1.5),
    color: THEME.colors.textLight,
  },
  linkText: {
    textAlign: "right",
    fontWeight: THEME.fonts.semibold,
    color: THEME.colors.primaryDark,
    textDecorationLine: "underline",
  },
  errorText: {
    color: THEME.colors.rose,
    fontSize: hp(1.8),
    fontWeight: THEME.fonts.medium,
  },
});

export default VerifyCodeScreen;
