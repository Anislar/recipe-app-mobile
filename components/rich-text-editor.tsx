import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { forwardRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";

interface RichTextEditorProps extends Partial<RichEditor> {
  onChange: (text: string) => void;
}
const RichTextEditor = forwardRef<RichEditor, RichTextEditorProps>(
  ({ onChange, ...props }, ref) => {
    const [emojiVisible, setEmojiVisible] = useState(false);
    return (
      <View style={{ flex: 1 }}>
        <RichToolbar
          editor={ref}
          actions={[
            actions.setBold,
            actions.setItalic,

            actions.setStrikethrough,
            actions.setUnderline,
            actions.insertOrderedList,
            actions.code,
            actions.heading1,
            actions.heading3,
            actions.heading5,
            "insertEmoji",
          ]}
          style={styles.toolbar}
          selectedIconTint={THEME.colors.text}
          iconMap={{
            insertEmoji: ({ tintColor }: any) => (
              <MaterialCommunityIcons
                size={20}
                onPress={() => setEmojiVisible((p) => !p)}
                name="emoticon"
                color={tintColor}
              />
            ),

            [actions.heading1]: ({ tintColor }: any) => (
              <Text style={[styles.tib, { color: tintColor }]}>H1</Text>
            ),
            [actions.heading3]: ({ tintColor }: any) => (
              <Text style={[styles.tib, { color: tintColor }]}>H3</Text>
            ),
            [actions.heading5]: ({ tintColor }: any) => (
              <Text style={[styles.tib, { color: tintColor }]}>H5</Text>
            ),
          }}
        />
        <RichEditor
          editorStyle={styles.richText}
          {...props}
          ref={ref}
          containerStyle={styles.containerStyle}
          placeholder="What's in your mind ?"
          onChange={(text) => onChange(text)}
        />
      </View>
    );
  }
);
RichTextEditor.displayName = "RichTextEditor";
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    padding: 5,
    maxHeight: hp(30),
    minHeight: hp(30),
    borderWidth: 1.5,
    borderBottomLeftRadius: THEME.radius.sm,
    borderBottomRightRadius: THEME.radius.sm,
    borderColor: THEME.colors.darkLight,
  },
  richText: {},
  toolbar: {
    borderTopRightRadius: THEME.radius.sm,
    borderTopLeftRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.gray,
  },
  tib: {
    textAlign: "center",
  },
});
export default RichTextEditor;
