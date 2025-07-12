import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store";
import { THEME } from "@/constants/colors";
import { useEffect, useRef } from "react";
import { Link } from "expo-router";
import {
  BackButton,
  Button,
  ScreenWrapper,
  SocialButtonComponent,
  TextInputComponent,
} from "@/components";
import { hp, wp } from "@/helpers/common";

const SignUp = () => {
  const emailRef = useRef("");
  const nameRef = useRef("");

  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");

  const { register, error, isLoading, setError } = useAuthStore();

  // Handle error display in useEffect to avoid setState during render
  useEffect(() => {
    if (error?.code === "REGISTRATION_FAILED") {
      alert(error.message);
      setError(null);
    }
  }, [error, setError]);

  const handleRegister = () => {
    if (emailRef.current && passwordRef.current) {
      register({
        name: nameRef.current,
        email: emailRef.current,
        password: passwordRef.current,
      });
    }
  };
  return (
    <ScreenWrapper bg="white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
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
              <TextInputComponent
                icon="person-outline"
                placeholder="Enter your name"
                onChangeText={(value) => {
                  nameRef.current = value;
                }}
              />
              <TextInputComponent
                icon="mail-outline"
                placeholder="Enter your email"
                onChangeText={(value) => {
                  emailRef.current = value;
                }}
              />
              <TextInputComponent
                icon="lock-closed-outline"
                secureTextEntry
                placeholder="Enter your password"
                onChangeText={(value) => {
                  passwordRef.current = value;
                }}
              />
              {/* <TextInputComponent
                icon="lock-closed-outline"
                secureTextEntry
                placeholder="Confirm your password"
                onChangeText={(value) => {
                  confirmPasswordRef.current = value;
                }}
              /> */}

              {/* Button */}
              <Button
                title="Sign Up"
                loading={isLoading}
                onPress={handleRegister}
              />
            </View>

            {/* Footer */}
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

            {/* Social Media */}
            <SocialButtonComponent />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  divider: {
    height: 1,
    backgroundColor: THEME.colors.gray,
  },
});
export default SignUp;
