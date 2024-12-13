import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import FastImage from "react-native-fast-image";
import { Colors } from "../assets/colors/color";
import { hp, wp } from "../helpers/common";
import { useRoute } from "@react-navigation/native";
import { Share2 } from "lucide-react-native";

const { height, width } = Dimensions.get("window");

const extractVideoId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
};

const ReelsPage = () => {
  const route = useRoute();
  const [videos, setVideos] = useState(route.params?.video || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playStates, setPlayStates] = useState({});
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (currentIndex === videos.length - 2) {
      fetchVideos();
    }
  }, [videos, currentIndex]);

  const fetchVideos = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/videos/getRandom`);
      const data = response.data;
      const newVideos = [...videos,...data];
      const uniqueVideos = new Set(newVideos.map((video) => video.id));
      setVideos((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = (index) => {
    setPlayStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const renderItem = ({ item, index }) => {
    const videoId = extractVideoId(item.videoUrl);
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;

    return (
      <View style={styles.videoContainer}>
        <Pressable
          style={styles.videoWrapper}
          onPress={() => {
            togglePlay(index);
          }}
        >
          {currentIndex === index ? (
            <YoutubePlayer
              play={!playStates[index]}
              videoId={videoId}
              height={320}
              width={width}
              webViewProps={{
                renderToHardwareTextureAndroid: true,
                allowsInlineMediaPlayback: true,
              }}
              initialPlayerParams={{
                controls: false,
                rel: false,
                modestbranding: true,
                iv_load_policy: 3,
                showinfo: 0,
                fs: false,
                playsinline: true,
              }}
              style={{ backgroundColor: Colors.black }}
            />
          ) : (
            <FastImage
              source={{ uri: thumbnailUrl }}
              style={{
                width: "70%",
                height: "70%",
                backgroundColor: Colors.black,
              }}
              resizeMode="cover"
            />
          )}
        </Pressable>
        <View style={styles.gradient}>
          <View
            style={{
              width: wp(95),
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: hp(1.5),
            }}
          >
            <FastImage
              source={{
                uri: item.thumbnail,
                priority: FastImage.priority.high,
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginBottom: 10,
              }}
            />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        </View>

        <View style={styles.interactionButtonsContainer}>
          <Pressable
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: hp(1),
            }}
            onPress={() => {
              console.log("HEre");
            }}
          >
            <View style={styles.iconButton}>
              <Share2 size={20} color={Colors.black} />
            </View>
            <Text
              style={{
                fontSize: hp(1.5),
                color: Colors.white,
              }}
            >
              Share
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({ changed }) => {
    if (changed && changed.length > 0) {
      setCurrentIndex(changed[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderFooter = () =>
    loading ? <ActivityIndicator size="large" color={Colors.white} /> : null;

  return (
    <FlatList
      ref={flatListRef}
      data={videos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      pagingEnabled
      snapToInterval={height}
      snapToAlignment="start"
      decelerationRate="fast"
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      onEndReached={fetchVideos}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height: height,
    width: width,
    backgroundColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  videoWrapper: {
    width: width,
    height: hp(100),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.black,
  },
  videoContainer: {
    height: height,
    width: width,
    backgroundColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  videoWrapper: {
    width: width,
    height: hp(100),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.black,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "30%",
    justifyContent: "flex-end",
    padding: 20,
  },
  title: {
    width: "70%",
    color: Colors.white,
    fontSize: wp(4.5),
    fontWeight: "bold",
    marginBottom: 10,
  },
  interactionButtonsContainer: {
    position: "absolute",
    right: 20,
    bottom: 100,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
    color: Colors.black,
    fontWeight: "bold",
  },
});

export default ReelsPage;
