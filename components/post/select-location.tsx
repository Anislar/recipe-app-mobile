import { View, Text, StyleSheet, Alert, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import * as Location from "expo-location";
import { Controller } from "react-hook-form";
import { Ref, useState } from "react";

import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import { Separator } from "../UI/separator";
import TextInputComponent from "../UI/text-input";
import { Button } from "../UI/button";

interface CategoryProps {
  control: any;
  ref?: Ref<TextInput>;
  onEditSubmit?: () => void;
  close: () => void;
}
const SelectLocation = ({
  control,
  ref,
  onEditSubmit,
  close,
}: CategoryProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = async (onChange: (value: any) => void) => {
    setError(null);
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("post.location.permissionDeniedTitle"),
          t("post.location.permissionDeniedDescription")
        );
        setLoading(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });
      const rev = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      const name =
        rev && rev.length
          ? `${rev[0].name || ""} ${rev[0].city || ""}`.trim()
          : `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(
              4
            )}`;

      onChange(name);
      close();
    } catch {
      setError("Could not get location");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Text style={styles.categoryTitle}>{t("post.location.label")} :</Text>
      <Controller
        control={control}
        name="location"
        render={({ field: { onChange } }) => (
          <>
            <Button
              icon="map-marker"
              title={t("post.location.placeholder")}
              onPress={() => handleGetLocation(onChange)}
              loading={loading}
            />
            {error && (
              <Text style={styles.errorText}>
                {t("common.error")}: {error}
              </Text>
            )}
          </>
        )}
      />

      <Separator />
      <Text style={styles.placeholder}>{t("post.location.infoSave")}</Text>
      <Controller
        control={control}
        name="location"
        render={({
          field: { value, onBlur, onChange },
          fieldState: { error },
        }) => (
          <View style={styles.categoryItemContainer}>
            <TextInputComponent
              label={t("account.updatePerson.location")}
              ref={ref}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t("account.updatePerson.locationPlaceholder")}
              autoCapitalize="words"
              returnKeyType="next"
              containerStyles={{
                flex: 1,
                marginBottom: hp(1),
                height: hp(9),
                borderColor: error ? THEME.colors.rose : undefined,
              }}
              onSubmitEditing={onEditSubmit}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        )}
      />
    </>
  );
};
const styles = StyleSheet.create({
  categoryTitle: {
    fontSize: hp(2),
    fontWeight: THEME.fonts.semibold,
    color: THEME.colors.text,
    paddingVertical: 10,
  },
  listContainer: {
    paddingHorizontal: wp(2),
  },
  categoryItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.5),
  },
  categoryName: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2.5),
  },
  label: {
    fontSize: hp(1.9),
    fontWeight: THEME.fonts.medium,
    color: THEME.colors.text,
  },
  placeholder: {
    marginLeft: 8,
    fontSize: hp(1.5),
    fontWeight: THEME.fonts.medium,
    color: THEME.colors.gray,
  },
  errorText: {
    fontSize: hp(1.6),
    color: THEME.colors.rose,
    marginTop: 4,
  },
});
export default SelectLocation;
