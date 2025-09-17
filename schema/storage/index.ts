import * as z from "zod";

// uploadFileSchema DTO
const uploadFileSchema = z.object({
  file: z.string(),
  source: z.enum(["user", "post"]),
});
type UploadFileType = z.infer<typeof uploadFileSchema>;

export { uploadFileSchema, type UploadFileType };
