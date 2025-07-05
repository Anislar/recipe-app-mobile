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
import { RegisterData } from "@/type";
import { Link } from "expo-router";

const SignUp = () => {
  const [registerForm, setRegisterForm] = useState<RegisterData>({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { register, error, isLoading, setError } = useAuthStore();

  const handleChange = (key: keyof RegisterData, value: string) => {
    setRegisterForm({ ...registerForm, [key]: value });
  };
  const handleLogin = () => {
    if (registerForm.email && registerForm.password) {
      register(registerForm);
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
          <Text style={authStyles.title}> Create an Account </Text>
          {/* Form */}
          <View style={authStyles.formContainer}>
            {/*Email Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Email"
                placeholderTextColor={COLORS.textLight}
                value={registerForm.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />
            </View>
            {/*Name Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Name"
                placeholderTextColor={COLORS.textLight}
                value={registerForm.name}
                onChangeText={(text) => handleChange("name", text)}
                keyboardType="default"
                autoCapitalize="none"
                autoComplete="name"
                returnKeyType="next"
              />
            </View>

            {/*Password Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Password"
                placeholderTextColor={COLORS.textLight}
                value={registerForm.password}
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

            {/*Confirm Password Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Confirm Password"
                placeholderTextColor={COLORS.textLight}
                value={registerForm.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
                keyboardType="default"
                autoCapitalize="none"
                secureTextEntry={showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
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
                  Already have an account?{" "}
                  <Link href="/sign-in">
                    <Text style={authStyles.link}>Sign In</Text>
                  </Link>
                </Text>
              </View>
              <View style={authStyles.divider} />
              <View style={authStyles.socialContainer}>
                <TouchableOpacity style={authStyles.socialButton}>
                  <Ionicons name="logo-github" size={26} />
                </TouchableOpacity>
                <TouchableOpacity style={authStyles.socialButton}>
                  <Ionicons name="logo-discord" size={26} />
                </TouchableOpacity>
                <TouchableOpacity style={authStyles.socialButton}>
                  <Ionicons name="logo-google" size={26} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;
