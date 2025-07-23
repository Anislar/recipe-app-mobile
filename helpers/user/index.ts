import * as z from "zod";

// Sign up DTO
const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, "At least 3 caracters")
    .max(20, "Max is 32 caracters")
    .optional(),
  bio: z
    .string()
    .min(3, "At least 3 caracters")
    .max(255, "Max is 255 caracters")
    .optional(),
  location: z
    .string()
    .min(3, "At least 3 caracters")
    .max(255, "Max is 255 caracters")
    .optional(),
  phone: z
    .string()
    .min(3, "At least 3 caracters")
    .max(255, "Max is 255 caracters")
    .optional(),
  avatar: z
    .string()
    .url("Invalid avatar URL")
    .regex(
      /^https:\/\/res\.cloudinary\.com\//,
      "Avatar must be a Cloudinary URL"
    )
    .optional(),
});
type UpdateUserType = z.infer<typeof updateUserSchema>;

export { updateUserSchema, UpdateUserType };
