import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useRef } from "react";
import { hp, wp } from "@/helpers/common";
import { ScreenWrapper, RichTextEditor, Button } from "@/components";
import { THEME } from "@/constants/theme";
import { RichEditor } from "react-native-pell-rich-editor";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
const AddPost = () => {
  const richText = useRef<RichEditor>(null);
  const bodyRef = useRef<string>("");
  return (
    <ScreenWrapper bg="white">
      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          paddingHorizontal: wp(2),
          gap: wp(2.5),
        }}
      >
        <View style={styles.textEditor}>
          <RichTextEditor
            onChange={(t) => (bodyRef.current = t)}
            ref={richText}
          />
        </View>
        <View style={styles.media}>
          <Text style={styles.addImageText}>Add Your Post</Text>
          <View style={styles.mediaIcons}>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="image-outline"
                size={24}
                color={THEME.colors.dark}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="video-outline"
                size={24}
                color={THEME.colors.dark}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Button title="Submit" />
      </ScrollView>
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginBottom: hp(2),
  },

  textEditor: {
    height: hp(35),
  },
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    padding: wp(2.5),
    paddingHorizontal: wp(5),
    borderRadius: THEME.radius.xl,
    borderCurve: "continuous",
    borderColor: THEME.colors.gray,
  },
  addImageText: {
    fontSize: hp(2),
    padding: 6,
    fontWeight: THEME.fonts.semibold,
    color: THEME.colors.text,
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: hp(2),
  },
});

export default AddPost;
