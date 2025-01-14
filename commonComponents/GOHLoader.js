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
    position: "absolute",
    top: 0,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
    // width:wp(100),
    // height:hp(100)
  },
});
