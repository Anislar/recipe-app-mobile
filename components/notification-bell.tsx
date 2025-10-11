// components/NotificationIcon.tsx
import { THEME } from "@/constants/theme";
import { useNotificationMutations } from "@/hooks/notification/useNotificationMutation";
import { useNotification } from "@/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FC, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface NotificationIconProps {
  // Optional external count override
  size?: number;
  color?: string;
  focused?: boolean;
}

export const NotificationIcon: FC<NotificationIconProps> = ({
  size = 32,
  color = THEME.colors.text,
  focused = false,
}) => {
  const scale = useSharedValue(1);
  const { notificationNumber, setNotificationNumber } = useNotification();
  const { size: length } = useNotificationMutations("unread");

  // Update badge count whenever notifications change
  useEffect(() => {
    setNotificationNumber(length);
  }, [length, setNotificationNumber]);

  // Animate the badge whenever count changes
  useEffect(() => {
    if (notificationNumber > 0) {
      scale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [notificationNumber, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/notification")}>
        <MaterialCommunityIcons
          size={size}
          name={focused ? "bell" : "bell-outline"}
          color={color}
        />
      </TouchableOpacity>

      {notificationNumber > 0 && (
        <Animated.View style={[styles.badge, animatedStyle]}>
          <Text style={styles.badgeText}>
            {notificationNumber > 99 ? "99+" : notificationNumber}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
