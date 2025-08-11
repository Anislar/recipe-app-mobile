import { forwardRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { t } from "i18next";

import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";

interface RichTextEditorProps extends Partial<RichEditor> {
  onChange: (text: string) => void;
}
const RichTextEditor = forwardRef<RichEditor, RichTextEditorProps>(
  ({ onChange, ...props }, ref) => {
    return (
      <View style={styles.content}>
        <RichToolbar
          editor={ref}
          actions={[
            "bold",
            "italic",
            "strikeThrough",
            "underline",
            "heading1",
            "heading3",
            "heading5",
            actions.insertOrderedList,
            actions.insertBulletsList,
            "code",
          ]}
          style={styles.toolbar}
          selectedIconTint={THEME.colors.text}
          iconMap={{
            [actions.heading1]: ({ tintColor }: any) => (
              <Text style={[styles.toolbarIcon, { color: tintColor }]}>H1</Text>
            ),
            [actions.heading3]: ({ tintColor }: any) => (
              <Text style={[styles.toolbarIcon, { color: tintColor }]}>H3</Text>
            ),
            [actions.heading5]: ({ tintColor }: any) => (
              <Text style={[styles.toolbarIcon, { color: tintColor }]}>H5</Text>
            ),
          }}
        />
        <RichEditor
          ref={ref}
          editorStyle={styles.richText}
          containerStyle={styles.containerStyle}
          placeholder={t("post.content.placeholder")}
          onChange={(text) => onChange(text)}
          {...props}
        />
      </View>
    );
  }
);
RichTextEditor.displayName = "RichTextEditor";
const styles = StyleSheet.create({
  content: { flex: 1 },
  containerStyle: {
    flex: 1,
    padding: 5,
    maxHeight: hp(20),
    minHeight: hp(20),
    borderWidth: 1,
    borderBottomRightRadius: THEME.radius.sm,
    borderBottomLeftRadius: THEME.radius.sm,
    borderColor: THEME.colors.darkLight,
  },
  richText: {
    color: THEME.colors.text,
  },
  toolbar: {
    borderTopRightRadius: THEME.radius.sm,
    borderTopLeftRadius: THEME.radius.sm,
  },
  toolbarIcon: {
    textAlign: "center",
  },
});
export default RichTextEditor;
