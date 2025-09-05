import { useState, useCallback } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { THEME } from "@/constants/theme";
import { ContextMenu } from "./context-menu";
import { hp, wp } from "@/helpers/common";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";

export function FullscreenImage({
  source,
  onAction,
}: {
  source: { uri: string };
  onAction: (type: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const handleClick = useCallback(
    (action: "share" | "download") => {
      setVisible(false);
      onAction?.(action);
    },
    [onAction]
  );

  return (
    <View>
      {/* Thumbnail */}
      <Pressable onPress={() => setVisible(true)}>
        <Image
          source={source}
          style={styles.thumbnail}
          transition={100}
          contentFit="cover"
        />
      </Pressable>

      {/* Fullscreen modal */}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.container}>
          <View style={[styles.context, { left: hp(2) }]}>
            <MaterialCommunityIcons
              onPress={() => setVisible(false)}
              name="close"
              size={24}
              color={THEME.colors.gray}
            />
          </View>
          <View style={styles.context}>
            <ContextMenu<"share" | "download">
              items={[
                {
                  type: "share",
                  name: t("post.action.share"),
                  icon: "share",
                },
                {
                  type: "download",
                  name: t("post.action.download"),
                  icon: "download",
                },
              ]}
              onAction={(type: "share" | "download") => handleClick(type)}
              menuWidth={120}
              left={0}
              top={0}
            />
          </View>

          <Image
            source={source}
            style={styles.fullscreen}
            transition={100}
            contentFit="contain"
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    width: wp(80),
    alignSelf: "center",
    height: 200,
    borderRadius: THEME.radius.xl,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.90)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    position: "relative",
  },
  context: {
    position: "absolute",
    top: hp(2),
    right: hp(2),
  },
  fullscreen: {
    width: "100%",
    height: "80%",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});
