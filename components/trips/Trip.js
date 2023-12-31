import React, { Component } from "react";
import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import {
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Carousel from "react-native-snap-carousel";

import { Tab, TabView } from "@rneui/themed";
import { View } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import { Itinerary } from "./Itinerary.js";

const SLIDER_WIDTH = Dimensions.get("window").width;
const SLIDER_HEIGHT = Dimensions.get("window").height * 0.25;
const ITEM_WIDTH = SLIDER_WIDTH;

class Trip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: null,
      error: true,
      index: 0,
    };
    crashlytics().log(JSON.stringify(props.propProfile));
    // alert(JSON.stringify(props));
  }

  CarouselComponent = ({ images }) => {
    return (
      <SafeAreaView style={styles.outsideContainer}>
        <Carousel
          layout="stack"
          autoplay={true}
          data={images}
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
  };

  CarouselCardItem = ({ item, index }) => {
    console.log(item);
    return (
      <TouchableOpacity key={index}>
        {/* <View style={styles.container}> */}
        <Image
          source={{ uri: item }}
          style={styles.image}
          // style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        {/* </View> */}
      </TouchableOpacity>
    );
  };

  componentDidMount() {}

  render() {
    return (
      <View style={styles.mainContainer}>
        {/* <Text>My Trips</Text> */}

        <this.CarouselComponent images={this.props.details.coverImages} />

        <Itinerary details={this.props.details} />
        {/* </ScrollView> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outsideContainer: {
    // padding: "3%",
    width: "100%",
    elevation: 20,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  textContainer: {
    padding: 16,
    marginTop: "auto",
    width: 200,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  coverImage: {
    marginTop: "-3%",
    width: "100%",
    flex: 0.5,
  },
  image: {
    width: ITEM_WIDTH + 10,
    height: SLIDER_HEIGHT,
    borderRadius: 2,
  },
});

const mapStateToProps = (state) => ({
  count: state.count.count,
  profile: state.profile.profile,
});
const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Trip);
