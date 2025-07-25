import * as z from "zod";
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  location?: string;
  bio?: string;
  phone?: string;
  isActive?: string;
  gender: string;
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

// Resend code DTO
const sendCodeSchema = z.object({
  email: z.string().email("Invalid email format"),
  path: z.enum(["verify-email", "password/forgot"]),
});
type SendCodeType = z.infer<typeof sendCodeSchema>;
// Verify Code DTO
const verifyCodeSchema = z.object({
  email: z.string().email("Invalid email format"),
  code: z
    .array(z.string().length(1, "Each digit is required")) // each input must have 1 char
    .length(4, "Code must be exactly 4 digits"), // enforce 4 inputs
  path: z.enum(["verify-email", "password/forgot"]),
});
type VerifyCodeType = z.infer<typeof verifyCodeSchema>;

// Reset password DTO
const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email format (eg: ex@example.com)"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password must be matched",
    path: ["password"],
  });
type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

export {
  signUpSchema,
  SignInSchema,
  resetPasswordSchema,
  verifyCodeSchema,
  sendCodeSchema,
  type SignUpType,
  type SignInType,
  type ResetPasswordType,
  type VerifyCodeType,
  type SendCodeType,
};
