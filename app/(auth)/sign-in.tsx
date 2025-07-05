import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store";
import { authStyles } from "@/assets/styles/auth.style";
import { COLORS } from "@/constants/colors";
import { useState } from "react";
import { LoginCredentials } from "@/type";
import { Link } from "expo-router";
import SocialButtonComponent from "@/components/social-button.compnent";

const Login = () => {
  const [loginForm, setLoginForm] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login, error, isLoading, setError } = useAuthStore();

  const handleChange = (key: keyof LoginCredentials, value: string) => {
    setLoginForm({ ...loginForm, [key]: value });
  };
  const handleLogin = () => {
    if (loginForm.email && loginForm.password) {
      login(loginForm);
    }
  };
  if (error) {
    alert(error);
    // clear error
    setError(null);
  }
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("@/assets/images/i1.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>
          <Text style={authStyles.title}> Welcome Back </Text>
          {/* Form */}
          <View style={authStyles.formContainer}>
            {/*Email Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Email"
                placeholderTextColor={COLORS.textLight}
                value={loginForm.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />
            </View>

            {/*Password Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Password"
                placeholderTextColor={COLORS.textLight}
                value={loginForm.password}
                onChangeText={(text) => handleChange("password", text)}
                keyboardType="default"
                autoCapitalize="none"
                secureTextEntry={showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            {/*Forgot Password */}
            <Link href="/forget-password" style={{ alignSelf: "flex-end" }}>
              <Text style={authStyles.link}>Forgot Password?</Text>
            </Link>
            {/*Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={[
                authStyles.authButton,
                isLoading && authStyles.buttonDisabled,
              ]}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={authStyles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
            {/*Sign Up Link */}
            <View style={authStyles.linkContainer}>
              <Text style={authStyles.linkText}>
                Don&apos;t have an account?{" "}
                <Link href="/sign-up">
                  <Text style={authStyles.link}>Sign Up</Text>
                </Link>
              </Text>
            </View>
            <View style={authStyles.divider} />
            <SocialButtonComponent />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
