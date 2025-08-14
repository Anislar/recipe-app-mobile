import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import { useSelectedColors } from "@/store";
import { Controller } from "react-hook-form";

interface LocationSelectorProps {
  control: any;
  style?: StyleProp<ViewStyle>;
  onOpen: () => void;
  labelExterne?: boolean;
}
export const LocationSelector = ({
  style,
  onOpen,
  control,
  labelExterne,
}: LocationSelectorProps) => {
  const { t } = useTranslation();
  const selected = useSelectedColors();

  return (
    <Controller
      name="location"
      control={control}
      render={({ field: { value } }) => (
        <View style={[styles.itemContainer]}>
          {labelExterne && (
            <Text style={styles.label}>{t("post.location.label")}:</Text>
          )}
          <TouchableOpacity
            onPress={() => onOpen()}
            style={[styles.selectorButton, style]}
            activeOpacity={0.7}
          >
            {!labelExterne && (
              <Text style={styles.labelInterne}>
                {t("post.location.label")}
              </Text>
            )}
            <View style={styles.button}>
              <View style={[styles.button, { justifyContent: "flex-start" }]}>
                {labelExterne && (
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={28}
                    color={selected.primary}
                  />
                )}

                <Text style={styles.label}>
                  {value ?? t("post.location.placeholderMin")}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={wp(5)}
                color={THEME.colors.darkGray}
              />
            </View>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    gap: hp(1),
    flex: 1,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
    justifyContent: "space-between",
  },
  selectorButton: {
    flexDirection: "row",
    padding: wp(4),
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.gray,
  },
  label: {
    fontSize: hp(1.6),
    color: THEME.colors.text,
    fontWeight: THEME.fonts.medium,
  },
  labelInterne: {
    color: THEME.colors.gray,
    fontSize: hp(1.5),
    marginBottom: hp(1),
    letterSpacing: wp(0.1),
  },
});
