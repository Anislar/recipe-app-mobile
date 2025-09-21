import * as z from "zod";

const commentSchema = z.object({
  content: z
    .string()
    .min(3, "At least 3 caracters")
    .max(255, "Max is 255 caracters"),
  parent_id: z.string().optional(),
});
type CommentType = z.infer<typeof commentSchema>;
export { commentSchema, type CommentType };
