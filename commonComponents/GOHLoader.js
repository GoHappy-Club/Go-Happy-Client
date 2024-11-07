import { StyleSheet } from "react-native";
import React from "react";
import Video from "react-native-video";

const GOHLoader = () => {
  return (
    <Video
      source={require("../images/logo_splash.mp4")}
      style={styles.loaderAnim}
      muted={true}
      repeat={true}
      resizeMode="cover"
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
  },
});
