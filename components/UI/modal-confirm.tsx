import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { THEME } from "@/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import { useSelectedColors } from "@/store";
import { hp, wp } from "@/helpers/common";
import { Separator } from "./separator";
import { Button } from "./button";

interface ModalConfirmProps {
  isVisible: boolean;
  close: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string;
  isDanger?: boolean;
}

export const ModalConfirm = ({
  isVisible,
  close,
  onSubmit,
  isDanger = false,
  isLoading = false,
  error = "",
}: ModalConfirmProps) => {
  const { t } = useTranslation();
  const selected = useSelectedColors();
  return (
    <Modal transparent visible={isVisible} animationType="fade">
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={close} />

      {/* Content */}
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t("common.confirmation")}</Text>
          <TouchableOpacity onPress={close}>
            <MaterialCommunityIcons
              name="close"
              size={22}
              color={THEME.colors.gray}
            />
          </TouchableOpacity>
        </View>
        <Separator my={hp(1)} mx={0} />

        {/* Message */}
        <Text style={styles.message}>{t("common.areYouSure")}</Text>
        {error && (
          <Text style={[styles.message, { color: THEME.colors.rose }]}>
            {error}
          </Text>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {/* Cancel */}
          <Button
            buttonStyle={styles.actionBtn}
            textStyle={styles.cancelText}
            title={t("common.cancel")}
            type="text"
            onPress={close}
          />

          <View style={styles.separator} />

          {/* Confirm */}
          <Button
            isDanger={isDanger}
            buttonStyle={styles.actionBtn}
            title={isDanger ? t("common.delete") : t("common.submit")}
            textStyle={[
              {
                color: isDanger ? THEME.colors.rose : selected?.primary + "90",
                textTransform: "capitalize",
              },
            ]}
            type="text"
            loading={isLoading}
            onPress={onSubmit}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000066",
  },
  modalContainer: {
    position: "absolute",
    top: hp(40),
    left: wp(5),
    right: wp(5),
    backgroundColor: "white",
    borderRadius: THEME.radius.md,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: THEME.fonts.semibold,
    color: THEME.colors.textDark,
  },
  message: {
    fontSize: hp(2),
    color: THEME.colors.textLight,
    marginBottom: hp(1.5),
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionBtn: {
    flex: 1,
  },
  cancelText: {
    fontSize: hp(1.9),
    color: THEME.colors.gray,
  },
  confirmText: {
    fontSize: hp(1.9),
    fontWeight: THEME.fonts.medium,
  },
  separator: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: THEME.colors.grayLight,
  },
});
