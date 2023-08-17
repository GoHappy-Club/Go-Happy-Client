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
} from "react-native";
import Carousel from "react-native-snap-carousel";

export default class TopBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  CarouselCardItem = ({ item, index }) => {
    console.log("imageimage", item);
    return (
      <TouchableOpacity
        style={styles.container}
        key={index}
        onPress={() => {
          if (item.isExternal == true) {
            Linking.openURL(item.url);
          } else if (item.isExternal == false && item.url.length > 0) {
            console.log(this);
            this.props.navigation.navigate(item.url);
          }
        }}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
        {/* <Text style={styles.header}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text> */}
      </TouchableOpacity>
    );
  };

  render() {
    const data = this.props.posters;
    data.sort((a, b) => a.order - b.order);
    const activePosters = data.filter((item) => item.isActive);
    return (
      <View style={styles.outsideContainer}>
        <Carousel
          // layout="tinder"
          // layoutCardOffset={9}
          autoplay={true}
          data={activePosters}
          renderItem={this.CarouselCardItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          inactiveSlideShift={0}
          useScrollView={true}
          ref={(c) => {
            this._carousel = c;
          }}
        />
      </View>
    );
  }
}

const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);

const styles = StyleSheet.create({
  outsideContainer: {
    // padding: "3%",
    width: "100%",
  },
  container: {
    marginTop: "5%",
    backgroundColor: "white",
    borderRadius: 8,
    width: ITEM_WIDTH,
    // paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  image: {
    width: ITEM_WIDTH,
    height: 170,
    borderRadius: 8,
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
