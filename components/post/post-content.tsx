import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";
import { useRef } from "react";
import RichTextEditor from "../rich-text-editor";

interface PostContentProps {
  control: any;
}
export const PostContent = ({ control }: PostContentProps) => {
  const richText = useRef<any>(null);
  const { t } = useTranslation();

  return (
    <View style={[styles.textEditor, styles.itemContainer]}>
      <Text style={styles.label}>
        {t("post.content.label")}{" "}
        <Text style={{ color: THEME.colors.rose }}>*</Text>:
      </Text>
      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <RichTextEditor value={value} onChange={onChange} ref={richText} />
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
