import { Dimensions } from "react-native";

const { width: widthDevice, height: heightDevice } = Dimensions.get("window");

const hp = (percentage: number) => {
  return (percentage * heightDevice) / 100;
};
const wp = (percentage: number) => {
  return (percentage * widthDevice) / 100;
};
export { hp, wp };
