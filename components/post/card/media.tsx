import React, { FC, memo } from "react";
import { FullscreenImage } from "@/components/UI/image";
interface Props {
  file: string | undefined;
  handleAction: (type: "share" | "download") => void;
}
export const PostMedia: FC<Props> = memo(({ file, handleAction }) => {
  if (file) {
    return (
      <FullscreenImage
        source={{ uri: file }}
        onAction={(type) => handleAction(type as "share" | "download")}
      />
    );
  }
  return null;
});
PostMedia.displayName = "PostMedia";
