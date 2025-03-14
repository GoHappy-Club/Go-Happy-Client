import {
  Linking,
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
import GOHLoader from "../../commonComponents/GOHLoader";
import { wp } from "../../helpers/common";
import { format, fromUnixTime } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

const categories = ["All", "Technology", "Sports"];

const NewsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("Technology");
  const ref = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchNews = async (swipedAll = false) => {
    if (swipedAll) {
      // ref.current.swipeTo(0);
      await new Promise((resolve) => {
        setPage((prev) => prev + 1);
        resolve();
      });
    }

    setLoading(true);

    try {
      await new Promise((resolve) => {
        setData([]);
        resolve();
      });

      const response = await axios.get(
        `https://inshorts.com/api/en/search/trending_topics/${selectedCategory == "All" ? "national" : selectedCategory.toLowerCase()}?page=${page}&type=NEWS_CATEGORY`
      );

      const newsData = response.data.data.suggested_news;
      const newData = newsData.map((news) => ({
        author: news.news_obj.author_name,
        source: news.news_obj.source_name,
        sourceUrl: news.news_obj.source_url,
        content: news.news_obj.content,
        title: news.news_obj.title,
        image: news.news_obj.image_url,
        date: news.news_obj.created_at,
        shortUrl: news.news_obj.shortened_url,
      }));

      setData(newData);
      setPage(1);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const loadDate = (date) => {
    const dt = fromUnixTime(date / 1000);
    const finalTime = format(dt, "MMM d, h:mm aa");
    return finalTime;
  };

  const renderCard = useCallback((newsObj) => {
    return (
      <View style={styles.renderCardContainer}>
        <View
          style={{
            height: "52%",
            width: "100%",
            borderRadius: 15,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <View
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              backgroundColor: Colors.grey.f0,
              padding: 5,
              borderRadius: wp(10),
              borderColor: "white",
              borderWidth: 1,
              paddingHorizontal: wp(3),
              backdropFilter: "blur(12px)",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
              zIndex: 100,
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-SemiBold",
                textAlign: "center",
              }}
            >
              {loadDate(newsObj.date)}
            </Text>
          </View>
          <FastImage
            source={{
              uri: newsObj.image,
              priority: FastImage.priority.high,
            }}
            style={styles.renderCardImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View
          style={{
            flex: 1,
            width: "100%",
            paddingHorizontal: wp(5),
            paddingTop: wp(3),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: 3,
                height: "80%",
                backgroundColor: Colors.yellow,
              }}
            />
            <Text
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: wp(5),
                width: "95%",
              }}
            >
              {newsObj.title}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Montserrat-Regular",
              fontSize: wp(3.2),
              letterSpacing: 1,
            }}
          >
            {newsObj.content}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: 10,
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: wp(2),
              }}
            >
              <Text
                style={{
                  fontSize: wp(3),
                  color: Colors.grey.countdown,
                  fontFamily: "Montserrat-Regular",
                }}
              >
                Author :
              </Text>
              <Text
                style={{
                  fontSize: wp(3),
                  color: Colors.black,
                  fontFamily: "Montserrat-Regular",
                }}
              >
                {newsObj?.author?.length > 0 ? newsObj.author : "Anonymous"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: wp(2),
              }}
            >
              <Text
                style={{
                  fontSize: wp(3),
                  color: Colors.grey.countdown,
                  fontFamily: "Montserrat-Regular",
                }}
              >
                Source :
              </Text>
              <Text
                style={{
                  fontSize: wp(3),
                  color: Colors.black,
                  fontFamily: "Montserrat-Regular",
                  textDecorationLine: "underline",
                }}
                onPress={() => {
                  Linking.openURL(newsObj.sourceUrl);
                }}
              >
                {newsObj.source}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.background,
        flex: 1,
      }}
    >
      {loading && (
        <View
          style={{
            backgroundColor: Colors.background,
            flex: 1,
          }}
        >
          <GOHLoader />
        </View>
      )}
      {!loading && (
        <>
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
                    selectedCategory === category &&
                      styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category &&
                        styles.categoryTextActive,
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
              data={data}
              renderCard={renderCard}
              onSwipedAll={() => {
                fetchNews(true);
              }}
            />
            <TouchableOpacity
              style={styles.swipeLeft}
              onPress={() => {
                ref.current?.swipeLeft();
              }}
            >
              <ChevronLeft color={Colors.black} size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.swipeRight}
              onPress={() => {
                ref.current?.swipeRight();
              }}
            >
              <ChevronRight color={Colors.black} size={24} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: wp(2),
              gap: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Montserrat-Regular",
                fontSize: wp(4),
                color:Colors.grey.countdown
              }}
            >
              Powered by Inshorts
            </Text>
            <FastImage
              source={require("../../images/inshorts.png")}
              style={{
                width: 32,
                aspectRatio: 1,
                alignSelf: "center",
              }}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  categoryWrapper: {
    marginBottom: 2,
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
    height: "90%",
    borderRadius: 15,
    marginVertical: 8,
  },
  renderCardContainer: {
    flex: 1,
    height: "90%",
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
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  subContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  overlayLabelContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  swipeLeft: {
    position: "absolute",
    top: "40%",
    width: 45,
    height: 45,
    backgroundColor: Colors.bottomNavigation,
    borderRadius: 30,
    transform: [{ translateY: -15 }],
    left: -10,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeRight: {
    position: "absolute",
    top: "40%",
    width: 45,
    height: 45,
    backgroundColor: Colors.bottomNavigation,
    borderRadius: 30,
    transform: [{ translateY: -15 }],
    right: -10,
    justifyContent: "center",
    alignItems: "center",
  },
});
