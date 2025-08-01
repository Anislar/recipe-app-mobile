import * as z from "zod";

// Sign up DTO
const uploadFileSchema = z.object({
  file: z.string(),
  source: z.enum(["user", "post"]),
});
type UploadFileType = z.infer<typeof uploadFileSchema>;

export { uploadFileSchema, type UploadFileType };
