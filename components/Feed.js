import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../assets/colors/color";
import FastImage from "react-native-fast-image";

const { width } = Dimensions.get("window");

export default function Feed({ videos }) {
  const navigation = useNavigation();

  const handlePlaylistPress = (video) => {
    const videoAsArray = Array.of(video);
    navigation.navigate("ReelsPage", {
      video: videoAsArray,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <View style={styles.line} />
        <Text style={styles.headingText}>Videos for you</Text>
        <View style={styles.line} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {videos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.playlistCard}
            onPress={() => handlePlaylistPress(video)}
            activeOpacity={0.5}
          >
            <FastImage
              resizeMode={FastImage.resizeMode.cover}
              source={{ uri: video.thumbnail }}
              style={styles.thumbnail}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 10,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: "5%",
    marginBottom: "2%",
  },
  headingText: {
    color: Colors.primaryText,
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.grey.grey,
  },
  playlistCard: {
    width: width * 0.4,
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.white,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  thumbnail: {
    width: "100%",
    height: width * 0.4 * 1.5,
    backgroundColor: Colors.grey.e,
  },
  titleContainer: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
});
