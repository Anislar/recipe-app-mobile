import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface MenuItem<T extends string = string> {
  type: T;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap; // icon name
}
interface MenuProps<T extends string = string> {
  items: MenuItem<T>[];

  onAction: (type: T) => void;
  menuWidth: number;
  left: number;
  top: number;
}

export const ContextMenu = <T extends string>({
  items,
  onAction,
  menuWidth = 120,
  left = 0,
  top = 20,
}: MenuProps<T>) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<any>(null);

  const openMenu = () => {
    if (buttonRef.current) {
      buttonRef.current?.measure(
        (
          _fx: any,
          _fy: any,
          _btnWidth: any,
          _btnHeight: number,
          _px: number,
          py: number
        ) => {
          setPosition({ x: wp(60 - left), y: py - top });
          setVisible(true);
        }
      );
    }
  };

  const closeMenu = () => setVisible(false);

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        onPress={openMenu}
        style={{ padding: 5 }}
      >
        <MaterialCommunityIcons
          name="dots-vertical"
          size={25}
          color={THEME.colors.gray}
        />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable style={styles.backdrop} onPress={closeMenu} />

        <View
          style={[
            styles.menu,
            { top: position.y, left: position.x, width: menuWidth },
          ]}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item.type}
              style={styles.menuItem}
              onPress={() => {
                onAction(item.type);
                closeMenu();
              }}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={20}
                color={
                  item.type === "delete" ? THEME.colors.rose : THEME.colors.text
                }
                style={styles.icon}
              />
              <Text
                style={[
                  styles.menuText,
                  {
                    color:
                      item.type === "delete"
                        ? THEME.colors.rose
                        : THEME.colors.text,
                  },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: THEME.colors.dark + 50,
  },
  menu: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
  },
  icon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    color: THEME.colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: THEME.colors.rose,
    marginVertical: 5,
  },
});
