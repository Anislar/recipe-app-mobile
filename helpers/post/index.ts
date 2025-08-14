import * as z from "zod";

export interface Post {
  id: string;
  content: string;
  category?: string;
  file?: string;
  location?: string;
  likes_count: number;
  userId?: string;
  createdAt?: string;
  liked: boolean;
}
// polls schema
const pollSchema = z
  .object({
    question: z.string().min(3, "Question must be at least 3 characters"),
    options: z
      .array(z.string().min(1, "Option cannot be empty"))
      .min(2, "At least 2 options required")
      .max(5, "Max 5 options allowed"),
    expiresAt: z.iso.datetime().optional(),
  })
  .refine(
    ({ options }) =>
      new Set(options.map((o) => o.trim().toLowerCase())).size ===
      options.length,
    { message: "Poll options must be unique" }
  );

// const categoryOptionSchema = z.object({
//   value: ,
//   label: z.string(),
//   icon: z.string(),
// });

// add post DTO
const addPostSchema = z.object({
  content: z.string().min(3, "At least 3 characters"),

  file: z
    .url("Invalid avatar URL")
    .regex(
      /^https?:\/\/res\.cloudinary\.com\//,
      "Avatar must be a Cloudinary URL"
    )
    .optional(),

  category: z.enum(
    ["general", "tech", "travel", "food", "art", "fitness", "lifestyle"],
    {
      message: "You must select a category",
    }
  ),

  location: z
    .string()
    .min(3, "At least 3 characters")
    .max(255, "Max is 255 characters")
    .optional(),
});

type AddPostType = z.infer<typeof addPostSchema>;

export { addPostSchema, AddPostType };
