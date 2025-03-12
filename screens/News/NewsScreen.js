import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Colors } from "../../assets/colors/color";
import { Swiper } from "rn-swiper-list";
import FastImage from "react-native-fast-image";
import axios from "axios";

const categories = ["All", "Technology", "Sports"];
const IMAGES = [
  require("../../images/rewards.png"),
  require("../../images/reels.png"),
  require("../../images/rewards.png"),
];

const NewsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const ref = useRef();
  const [images, setImages] = useState(IMAGES);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          "https://inshorts.com/api/en/search/trending_topics/sports?page=1&type=NEWS_CATEGORY"
        );
        console.log(response.data.data.suggested_news.length);
        console.log(response.data.data.news_list.length);
        // const fetchedImages = response.data.articles.map((article) => ({
        //   id: article.title,
        //   imageUrl: article.urlToImage || "https://via.placeholder.com/300", // Fallback image
        // }));
        // setImages(fetchedImages);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, [selectedCategory]);

  const renderCard = useCallback((image) => {
    return (
      <View style={styles.renderCardContainer}>
        <FastImage
          source={image}
          style={styles.renderCardImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    );
  }, []);
  const OverlayLabelRight = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: Colors.primary,
          },
        ]}
      />
    );
  }, []);
  const OverlayLabelLeft = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: Colors.primary,
          },
        ]}
      />
    );
  }, []);
  const OverlayLabelTop = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: Colors.primary,
          },
        ]}
      />
    );
  }, []);
  const OverlayLabelBottom = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: Colors.primary,
          },
        ]}
      />
    );
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.background,
        flex: 1,
      }}
    >
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.subContainer}>
        <Swiper
          ref={ref}
          cardStyle={styles.cardStyle}
          data={images}
          renderCard={renderCard}
          onIndexChange={(index) => {
            console.log("Current Active index", index);
          }}
          onSwipedAll={() => {
            console.log("onSwipedAll");
          }}
          onSwipeLeft={(cardIndex) => {
            console.log("onSwipeLeft", cardIndex);
            const length = IMAGES.length;
            console.log("onSwipeLeft", IMAGES[cardIndex % length]);
            setImages((prev) => [...prev, IMAGES[cardIndex % length]]);
          }}
          onSwipeRight={(cardIndex) => {
            console.log("cardIndex", cardIndex);
            const length = IMAGES.length;
            console.log("onSwipeRight", IMAGES[cardIndex % length]);
            setImages((prev) => [...prev, IMAGES[cardIndex % length]]);
          }}
          onSwipeTop={(cardIndex) => {
            console.log("onSwipeTop", cardIndex);
            const length = IMAGES.length;
            console.log("onSwipeLeft", IMAGES[cardIndex % length]);
            setImages((prev) => [...prev, IMAGES[cardIndex % length]]);
          }}
          onSwipeBottom={(cardIndex) => {
            console.log("onSwipeBottom", cardIndex);
            const length = IMAGES.length;
            console.log("onSwipeBottom", IMAGES[cardIndex % length]);
            setImages((prev) => [...prev, IMAGES[cardIndex % length]]);
          }}
          OverlayLabelRight={OverlayLabelRight}
          OverlayLabelLeft={OverlayLabelLeft}
          OverlayLabelTop={OverlayLabelTop}
          OverlayLabelBottom={OverlayLabelBottom}
        />
      </View>
    </SafeAreaView>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  categoryWrapper: {
    marginBottom: 10,
  },
  categoryContent: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.black,
    borderWidth: 1,
    elevation: 2,
  },
  categoryText: {
    color: Colors.primaryText,
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: Colors.primaryText,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    bottom: 34,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  button: {
    height: 50,
    borderRadius: 40,
    aspectRatio: 1,
    backgroundColor: "#3A3D45",
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardStyle: {
    width: "95%",
    height: "85%",
    borderRadius: 15,
    marginVertical: 20,
  },
  renderCardContainer: {
    flex: 1,
    height: "85%",
    width: "100%",
    elevation: 10,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.grey.f0,
    borderRadius: 15,
  },
  renderCardImage: {
    height: "100%",
    width: "100%",
    borderRadius: 15,
  },
  subContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayLabelContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
});
