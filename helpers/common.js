import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const wp = (percentage) => {
  return (width * percentage) / 100;
};
export const hp = (percentage) => {
  return (height * percentage) / 100;
};
