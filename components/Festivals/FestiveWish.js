import { Image, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { hp, wp } from "../../helpers/common";
import { Video,ResizeMode } from "expo-av";
import { Colors } from "../../assets/colors/color";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import RNFS from "react-native-fs";
import { Button } from "react-native-elements";

const FestiveWish = () => {
  const route = useRoute();
  const { title, asset, message } = route.params;
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);

  const ref = useRef();

  useEffect(() => {
    setIsVideo(asset.includes("mp4") || asset.includes("webm"));
  }, [asset]);

  const shareMedia = async () => {
    try {
      setLoading(true);
      const base64Data = await captureRef(ref, {
        format: "png",
        quality: 0.9,
        result: "base64",
      });
      const filePath = `${RNFS.TemporaryDirectoryPath}/${title}.png`;

      await RNFS.writeFile(filePath, base64Data, "base64");

      await Share.open({
        url: `file://${filePath}`,
        message: message,
        title: title,
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error("Error in sharing:", e);
    }
  };
  return (
    <>
      {/* <BlurView style={styles.blurView} blurAmount={1} blurType="dark" /> */}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 0,
        }}
      />
      <View style={styles.container}>
        <ViewShot ref={ref}>
          {isVideo ? (
            <Video
              source={{ uri: asset }}
              style={styles.media}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={true}
              controls={false}
              repeat
              muted={true}
            />
          ) : (
            <FastImage
              source={{ uri: asset }}
              style={styles.media}
              resizeMode="cover"
              h
            />
          )}
        </ViewShot>
        <Button
          outline
          title={"Share"}
          loading={loading}
          buttonStyle={styles.shareButton}
          onPress={shareMedia}
          disabled={loading}
          loadingProps={{ color: "black" }}
        />
        {/* <Pressable style={styles.shareButton} onPress={shareMedia}>
          <Text style={styles.shareButtonText}>Share</Text>
        </Pressable> */}
      </View>
    </>
  );
};

export default FestiveWish;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  media: {
    width: wp(90),
    height: hp(70),
    borderRadius: 20,
    overflow: "hidden",
    zIndex: 20,
  },
  shareButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    zIndex: 3,
    width: wp(90),
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
