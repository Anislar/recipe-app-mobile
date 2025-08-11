import { Controller } from "react-hook-form";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

import RichTextEditor from "../rich-text-editor";
import { hp } from "@/helpers/common";
import { useRef } from "react";
import { THEME } from "@/constants/theme";

interface PostContentProps {
  control: any;
}
const PostContent = ({ control }: PostContentProps) => {
  const richText = useRef<any>(null);
  const { t } = useTranslation();

  return (
    <View style={[styles.textEditor, styles.itemContainer]}>
      <Text style={styles.label}>{t("post.content.label")}:</Text>
      <Controller
        control={control}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <>
            <RichTextEditor onChange={onChange} ref={richText} />
            {error && (
              <Text style={[styles.errorText, { top: hp(2.3) }]}>
                {t("common.error") + " : " + error.message}
              </Text>
            )}
          </>
        )}
        name="content"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  textEditor: {
    height: hp(28),
  },
  itemContainer: {
    gap: hp(1),
    flex: 1,
  },
  errorText: {
    color: THEME.colors.rose,
    fontSize: hp(1.5),
    marginLeft: 5,
  },
  label: {
    fontSize: hp(1.6),
    color: THEME.colors.text,
    fontWeight: THEME.fonts.medium,
  },
});
export default PostContent;
