import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import React from "react";
import { Platform, StyleSheet, Text } from "react-native";
import RenderHtml from "react-native-render-html";

type Props = {
  html: string;
};

export const RichTextContent: React.FC<Props> = ({ html }) => {
  const contentWidth = wp(80);
  const isHtml = /<[^>]*>/g.test(html);

  const tagsStyles = {
    body: {
      fontSize: 16,
      lineHeight: 22,
      color: "#111827",
      fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    p: { marginBottom: 8, marginTop: 0 },
    strong: { fontWeight: "600" },
    em: { fontStyle: "italic" },
    h1: {
      fontSize: hp(3),
      fontWeight: THEME.fonts.bold,
      marginBottom: 12,
      marginTop: 8,
      color: "#111827",
    },
    h3: {
      fontSize: hp(2),
      fontWeight: THEME.fonts.semibold,
      marginBottom: 10,
      marginTop: 6,
      color: "#111827",
    },
    h5: {
      fontSize: hp(1.5),
      fontWeight: THEME.fonts.semibold,
      marginBottom: 8,
      marginTop: 4,
      color: "#111827",
    },

    ul: { paddingLeft: 0, marginBottom: 8 },
    ol: { paddingLeft: 0, marginBottom: 8 },
    li: { marginBottom: 4 },
    code: {
      backgroundColor: "#F3F4F6",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 14,
      fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    },
    pre: {
      backgroundColor: "#1F2937",
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
    },
    a: { color: "#3B82F6", textDecorationLine: "underline" },
  } as const;

  if (!isHtml) {
    return <Text style={styles.text}>{html}</Text>;
  }

  return (
    <RenderHtml
      contentWidth={contentWidth}
      source={{ html }}
      tagsStyles={tagsStyles as any}
      defaultTextProps={{ selectable: true }}
      systemFonts={Platform.OS === "ios" ? ["System"] : ["Roboto"]}
      renderersProps={{ img: { enableExperimentalPercentWidth: true } }}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: "#111827",
  },
});

export default RichTextContent;
