import * as z from "zod";
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}
// Sign up DTO
const signUpSchema = z.object({
  email: z.string().email("Invalid email format (eg: ex@example.com)"),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
type SignUpType = z.infer<typeof signUpSchema>;

// Sign in DTO
const SignInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
type SignInType = z.infer<typeof SignInSchema>;

// Forgot password DTO
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});
type FogotPasswordType = z.infer<typeof forgotPasswordSchema>;

// Verify Code DTO
const verifyCodeSchema = z.object({
  email: z.string().email("Invalid email format"),
  token: z.string().length(4, "Token must be at 4 characters"),
});
type VerifyCodeType = z.infer<typeof verifyCodeSchema>;

// Reset password DTO
const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password !== data.confirmPassword, {
    message: "Password must be matched",
  });
type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

export {
  signUpSchema,
  SignInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyCodeSchema,
  type SignUpType,
  type SignInType,
  type FogotPasswordType,
  type ResetPasswordType,
  type VerifyCodeType,
};
