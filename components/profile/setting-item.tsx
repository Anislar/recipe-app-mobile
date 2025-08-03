import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import { Separator } from "../UI/separator";

interface ItemType {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress?: () => void;
  isDanger?: boolean;
  suffix?: React.ReactNode;
}
interface ISettingsItem {
  group: string;
  item: ItemType[];
}
export const SettingsItem = ({ group, item }: ISettingsItem) => {
  return (
    <>
      {group === "seperator" ? (
        <Separator />
      ) : (
        item && (
          <View style={styles.content}>
            <Text style={styles.group}>{group} </Text>
            {item.map((el, index) => {
              const Container = el.onPress ? TouchableOpacity : View;

              return (
                <Container
                  key={index}
                  onPress={el.onPress}
                  style={styles.optionRow}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: el.isDanger
                          ? THEME.colors.roseLight
                          : THEME.colors.darkLight,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={el.icon}
                      size={20}
                      color={
                        el.isDanger ? THEME.colors.rose : THEME.colors.text
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: el.isDanger
                          ? THEME.colors.rose
                          : THEME.colors.text,
                      },
                    ]}
                  >
                    {el.label}
                  </Text>

                  {el.suffix ? (
                    <View style={styles.suffix}>{el.suffix}</View>
                  ) : (
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      style={{
                        color: el.isDanger
                          ? THEME.colors.rose
                          : THEME.colors.text,
                      }}
                    />
                  )}
                </Container>
              );
            })}
          </View>
        )
      )}
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: wp(1),
  },
  group: {
    color: THEME.colors.gray,
    fontSize: hp(1.6),
    fontWeight: THEME.fonts.bold,
  },
  iconContainer: {
    padding: 5,
    borderRadius: THEME.radius.md,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: hp(1.2),
  },
  optionLabel: { flex: 1, marginLeft: wp(2), fontSize: hp(1.8) },
  suffix: {
    position: "absolute",
    right: wp(2),
  },
});
