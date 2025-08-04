import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";

import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";

type AccordionProps = {
  title: string;
  content: string;
};
const Accordion = ({ title, content }: AccordionProps) => {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  return (
    <TouchableOpacity
      style={styles.wrapper}
      activeOpacity={0.9}
      onPress={toggle}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <MaterialCommunityIcons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={THEME.colors.text}
        />
      </View>
      {expanded && (
        <View style={styles.contentWrapper}>
          <Text style={styles.content}>{content}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: THEME.radius.md,
    marginBottom: hp(1.5),
    backgroundColor: THEME.colors.grayLight,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: "500",
    color: THEME.colors.text,
    flex: 1,
    paddingRight: wp(1),
  },
  contentWrapper: {
    paddingHorizontal: wp(2),
    paddingBottom: hp(2),
  },
  content: {
    fontSize: hp(1.6),
    color: THEME.colors.darkGray,
  },
});

export default Accordion;
