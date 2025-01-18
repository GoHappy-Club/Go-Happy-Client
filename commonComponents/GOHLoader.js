import { StyleSheet } from "react-native";
import React from "react";
import { ResizeMode, Video } from "expo-av";
import { hp, wp } from "../helpers/common";

const GOHLoader = () => {
  return (
    <Video
      source={require("../images/logo_splash.mp4")}
      shouldPlay={true}
      style={styles.loaderAnim}
      isMuted={true}
      isLooping={true}
      resizeMode={ResizeMode.CONTAIN}
    />
  );
};

export default GOHLoader;

const styles = StyleSheet.create({
  loaderAnim: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
    height: hp(100),
    width: wp(100),
  },
});
