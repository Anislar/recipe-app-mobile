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
      toValue: !expanded ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => setExpanded((p) => !p));
  };

  const topOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.section,
          {
            opacity: topOpacity,
          },
        ]}
      >
        {expanded ? null : TopView}
      </Animated.View>

      <Animated.View style={[styles.section]}>
        {BottomView({ expanded, toggleExpand })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    overflow: "hidden",
  },
});
