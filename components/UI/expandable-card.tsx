import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";
import { FC, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

interface ExpandableCardProps {
  TopView: React.ReactNode;
  BottomView: (props: {
    expanded: boolean;
    toggleExpand: () => void;
  }) => React.ReactNode;
}

export const ExpandableCard: FC<ExpandableCardProps> = ({
  TopView,
  BottomView,
}) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 500,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start(() => {
      setExpanded((prev) => !prev);
    });
  };

  // Interpolate heights
  const topHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [hp(45), hp(0)],
  });

  const bottomHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [hp(55), hp(100)],
  });

  const topOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0.1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,

          {
            height: topHeight,
            opacity: topOpacity,
          },
        ]}
      >
        {TopView}
      </Animated.View>

      <Animated.View style={[styles.content, { height: bottomHeight }]}>
        {BottomView({ expanded, toggleExpand })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: "#fff",
  },
});
