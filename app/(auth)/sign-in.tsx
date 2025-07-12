import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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

const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const { login, error, isLoading, setError } = useAuthStore();

  // Handle error display in useEffect to avoid setState during render
  useEffect(() => {
    if (error?.code === "LOGIN_FAILED") {
      alert(error.message);
      setError(null);
    }
  }, [error, setError]);

  const handleLogin = () => {
    if (emailRef.current && passwordRef.current) {
      login({
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
              <Text style={styles.welcomeText}>Hey,</Text>
              <Text style={styles.welcomeText}>Welcome Back</Text>
            </View>
            {/* form */}
            <View style={styles.form}>
              <Text style={styles.form_description}>
                Please login to continue
              </Text>
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
              <Link href="/(auth)/forget-password" push>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </Link>
              {/* Button */}
              <Button
                title="Sign In"
                loading={isLoading}
                onPress={handleLogin}
              />
            </View>

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
export default Login;
