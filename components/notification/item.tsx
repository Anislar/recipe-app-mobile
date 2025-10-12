import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { Avatar } from "@/components";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { formatTimeAgo } from "@/helpers/utils";
import { useSelectedColors } from "@/store";
import { Notification } from "@/type";

interface Props {
  notification: Notification;
  index: number;
  markAsRead: (id: number) => void;
  deleteNotification: (id: number) => void;
  isDeleting: boolean;
}

export const NotificationCard: FC<Props> = ({
  notification,
  index,
  markAsRead,
  deleteNotification,
  isDeleting,
}) => {
  const { t } = useTranslation();
  const animationDelay = index < 10 ? index * 50 : 0;
  const shouldAnimate = index < 10;
  const { primary } = useSelectedColors();
  const getActionText = () => {
    console.log("🚀 ~ getActionText ~ notification:", notification);
    if (notification.type === "like")
      return t(`notification.like.${notification.targetType}.withoutName`);
    if (notification.type === "comment")
      return t(`notification.comment.new.withoutName`);
    if (notification.type === "reply")
      return t(`notification.reply.new.withoutName`);
    return "notification";
  };

  const getIconProps = () => {
    const map = {
      comment: { name: "chatbubble", color: THEME.colors.blue },
      like: { name: "heart", color: THEME.colors.rose },
      reply: { name: "chatbubble", color: THEME.colors.skyBlue },
      default: { name: "notifications", color: THEME.colors.gray },
    };
    return map[notification.type] ?? map.default;
  };

  const iconProps = getIconProps();

  return (
    <Animated.View
      entering={
        shouldAnimate
          ? FadeInDown.delay(animationDelay).duration(300)
          : undefined
      }
      exiting={FadeOut}
    >
      <TouchableOpacity
        onPress={() => !notification.isRead && markAsRead(notification.id)}
        activeOpacity={0.7}
        style={[styles.card, !notification.isRead && styles.unread]}
      >
        <Avatar
          name={notification.actor.name}
          uri={notification.actor.avatar!}
          rounded={THEME.radius.xxl}
          style={{
            backgroundColor: primary,
            borderWidth: 0,
          }}
        />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.actionName}>{notification.actor.name}</Text>
            <Text style={styles.actionText}>{getActionText()}</Text>
            <Ionicons
              name={iconProps.name as any}
              size={16}
              color={iconProps.color}
            />
          </View>

          {notification.type !== "like" && notification.comment?.content && (
            <Text style={styles.comment} numberOfLines={2}>
              &ldquo;{notification.comment.content}&ldquo;
            </Text>
          )}

          <View style={styles.footerRow}>
            <Text style={styles.postInfo} numberOfLines={1}>
              {t("notification.on")}:{" "}
              {notification.post?.content || notification.parent?.content}
            </Text>
            <Text style={styles.time}>
              {formatTimeAgo(notification.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.rightActions}>
          {!notification.isRead && <View style={styles.dot} />}
          <TouchableOpacity
            disabled={isDeleting}
            onPress={() => deleteNotification(notification.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: wp(3.5),
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
    backgroundColor: THEME.colors.white,
  },
  unread: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
    flexWrap: "wrap",
  },
  actionName: {
    fontWeight: THEME.fonts.bold,
    fontSize: hp(1.7),
    color: THEME.colors.text,
  },
  actionText: {
    fontSize: hp(1.4),
    color: THEME.colors.grey2,
  },
  comment: {
    fontSize: hp(1.45),
    color: THEME.colors.text,
    marginTop: 4,
    marginBottom: 6,
    lineHeight: hp(2),
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  postInfo: {
    fontSize: hp(1.2),
    color: THEME.colors.grey2,
    fontWeight: THEME.fonts.medium,
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: hp(1.2),
    color: THEME.colors.darkGray,
  },
  rightActions: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: THEME.radius.xl,
    backgroundColor: THEME.colors.blue,
  },
});
