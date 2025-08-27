import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";

interface MenuProps {
  onUpdate?: () => void;
  onDelete?: () => void;
  menuWidth: number;
}

const ContextMenu: React.FC<MenuProps> = ({
  onUpdate,
  onDelete,
  menuWidth = 120,
}) => {
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
          setPosition({ x: wp(65), y: py });
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
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onUpdate?.();
              closeMenu();
            }}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={20}
              color={THEME.colors.text}
              style={styles.icon}
            />
            <Text style={styles.menuText}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onDelete?.();
              closeMenu();
            }}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color={THEME.colors.rose}
              style={styles.icon}
            />
            <Text style={[styles.menuText, { color: THEME.colors.rose }]}>
              Delete
            </Text>
          </TouchableOpacity>
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

export default ContextMenu;
