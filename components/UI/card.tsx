import { View, StyleSheet } from "react-native";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
interface CardProps {
  children: React.ReactNode;
}
const CardComponent = ({ children }: CardProps) => {
  return <View style={styles.card}>{children}</View>;
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.grayLight,
    padding: wp(6),
    borderRadius: THEME.radius.xl,
    gap: hp(2),
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
});
export default CardComponent;
