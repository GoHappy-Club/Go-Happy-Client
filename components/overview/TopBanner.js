import React, { Component } from "react";
import { Card } from "react-native-paper";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Carousel from "react-native-snap-carousel";

export default class TopBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageDimensions: { width: 0, height: 0 },
    };
  }

  CarouselCardItem = ({ item, index }) => {
    console.log("imageimage", item);
    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        key={index}
        onPress={async () => {
          if (item.isExternal == true) {
            Linking.openURL(item.url);
          } else if (item.isExternal == false && item.url.length > 0) {
            console.log(this);
            this.props.navigation.navigate(item.url, JSON.parse(item.params));
          }
        }}
      >
        {/* <View style={styles.container}> */}
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          // style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
        {/* </View> */}
      </TouchableOpacity>
    );
  };

  render() {
    const data = this.props.posters;
    data.sort((a, b) => a.order - b.order);
    const activePosters = data.filter((item) => item.isActive);
    return (
      <SafeAreaView style={styles.outsideContainer}>
        <Carousel
          // layout="tinder"
          // layoutCardOffset={9}
          // style={{ flex: 1, width: "100%" }}
          autoplay={true}
          data={activePosters}
          renderItem={this.CarouselCardItem}
          sliderWidth={SLIDER_WIDTH}
          sliderHeight={SLIDER_HEIGHT}
          itemWidth={ITEM_WIDTH}
          inactiveSlideShift={0}
          useScrollView={true}
          ref={(c) => {
            this._carousel = c;
          }}
        />
      </SafeAreaView>
    );
  }
}

const SLIDER_WIDTH = Dimensions.get("window").width;
const SLIDER_HEIGHT = Dimensions.get("window").height * 0.25;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);

const styles = StyleSheet.create({
  outsideContainer: {
    // padding: "3%",
    width: "100%",
  },
  container: {
    elevation: 5, // Set the elevation value as desired
    borderRadius: 8, // Optional: Add border radius for a card-like effect
    overflow: "hidden", // Clip the shadow to avoid overflow issues
  },
  image: {
    width: ITEM_WIDTH + 10,
    height: SLIDER_HEIGHT,
    borderRadius: 8,
    // borderColor: "black",
    // borderWidth: 0.1,
  },
  header: {
    color: "#222",
    fontSize: 28,
    fontWeight: "bold",
    paddingLeft: 20,
    // paddingTop: 20,
  },
  body: {
    color: "#222",
    fontSize: 18,
    paddingLeft: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
});
