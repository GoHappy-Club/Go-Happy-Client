import React, { Component } from "react";
//import axios from "axios";
import Video from "react-native-video";
import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import { ScrollView } from "react-native-gesture-handler";
import {
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Tab, TabView, Text } from "@rneui/themed";
import { View } from "react-native";
import TripsList from "../../components/trips/TripsList.js";
import { Colors } from "../../assets/colors/color.js";
import GOHLoader from "../../commonComponents/GOHLoader.js";
import Carousel from "react-native-snap-carousel";
import FastImage from "react-native-fast-image";

const SLIDER_WIDTH = Dimensions.get("window").width;
const SLIDER_HEIGHT = Dimensions.get("window").height * 0.25;
const ITEM_WIDTH = SLIDER_WIDTH;

class TripsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phoneNumber: "",
      password: "",
      showAlert: false,
      childLoader: false,
      events: [],
      error: true,
      index: 0,
      pastTrips: [],
      upcomingTrips: [],
      tripImages: [],
    };
    crashlytics().log(JSON.stringify(props.propProfile));
    this._carousel = null;
    // alert(JSON.stringify(props));
  }

  getProperties = async () => {
    try {
      const response = await axios.get(SERVER_URL + "/properties/list");
      const properties = response.data.properties[0];
      this.setState({ topBannerImages: properties?.tripImages });
    } catch (error) {
      crashlytics().log(`Error in getProperties ${error}`);
      console.log("Error in getProperties", error);
    }
  };

  async getPastTripsData() {
    var url = SERVER_URL + "/trips/past";
    try {
      const response = await axios.get(url);
      if (response.data) {
        this.setState({
          pastTrips: response.data.trips,
        });
      }
    } catch (error) {
      crashlytics().log(`Error in getPastTripsData ${error}`);
      this.error = true;
    }
  }

  async getUpcomingTripsData() {
    var url = SERVER_URL + "/trips/upcoming";
    try {
      const response = await axios.get(url);
      if (response.data) {
        this.setState({
          upcomingTrips: response.data.trips,
        });
      }
    } catch (error) {
      this.error = true;
      crashlytics().log(`Error in getUpcomingTripsData ${error}`);
      // throw new Error("Error getting order ID");
    }
  }

  componentWillMount() {
    this.getPastTripsData();
    this.getUpcomingTripsData();
    this.getProperties();
  }
  CarouselCardItem = ({ item, index }) => {
    return (
      <TouchableOpacity key={index}>
        <FastImage
          source={{ uri: item }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );
  };

  render() {
    if (this.state.error == true) {
      return (
        <SafeAreaView style={styles.mainContainer}>
          {this.state.topBannerImages &&
            (this.state.topBannerImages?.length <= 1 ? (
              <ImageBackground
                source={{
                  uri: this.state.topBannerImages[0],
                }}
                style={styles.coverImage}
                resizeMode="cover"
              >
                <View style={styles.textContainer}>
                  <Text style={styles.coverTitle}>TRIPS</Text>
                </View>
              </ImageBackground>
            ) : (
              <SafeAreaView style={styles.outsideContainer}>
                <Carousel
                  layout="default"
                  autoplay={true}
                  data={this.state.topBannerImages}
                  renderItem={this.CarouselCardItem}
                  sliderWidth={SLIDER_WIDTH}
                  sliderHeight={SLIDER_HEIGHT}
                  itemWidth={ITEM_WIDTH}
                  inactiveSlideShift={0}
                  useScrollView={true}
                  ref={(c) => {
                    this._carousel = c;
                  }}
                  autoplayDelay={10}
                  autoplayInterval={1500}
                />
                <View
                  style={[
                    styles.textContainer,
                    {
                      position: "absolute",
                      bottom: 0,
                    },
                  ]}
                >
                  <Text style={styles.coverTitle}>TRIPS</Text>
                </View>
              </SafeAreaView>
            ))}
          <Tab
            value={this.state.index}
            onChange={(index) => {
              this.setState({ index: index });
            }}
            style={{ backgroundColor: Colors.background }}
            dense
            indicatorStyle={{
              backgroundColor: Colors.black, // Change the indicator color to green
            }}
            titleStyle={{
              color: Colors.black, // Set color of both active and inactive tab labels to green
            }}
          >
            <Tab.Item>Upcoming</Tab.Item>
            <Tab.Item>Past</Tab.Item>
          </Tab>
          <TabView
            containerStyle={{
              height: "100%",
            }}
            value={this.state.index}
            onChange={(index) => {
              this.setState({ index: index });
            }}
            animationType="spring"
          >
            <TabView.Item
              style={{
                width: "100%",
                height: "100%",
                display:
                  Platform.OS === "android"
                    ? "flex"
                    : this.state.index == 0
                      ? "flex"
                      : "none",
              }}
            >
              <TripsList
                trips={this.state.upcomingTrips}
                navigation={this.props.navigation}
              />
            </TabView.Item>
            <TabView.Item
              style={{
                width: "100%",
                height: "100%",
                display:
                  Platform.OS === "android"
                    ? "flex"
                    : this.state.index == 1
                      ? "flex"
                      : "none",
              }}
            >
              <TripsList
                type="past"
                trips={this.state.pastTrips}
                navigation={this.props.navigation}
              />
            </TabView.Item>
          </TabView>
        </SafeAreaView>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.background,
          }}
        >
          <GOHLoader />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  outsideContainer: {
    width: "auto",
    elevation: 20,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.background,
  },
  textContainer: {
    padding: 16,
    marginTop: "auto",
    // width: 200,
    alignSelf: "flex-start",
  },
  coverTitle: {
    paddingLeft: "5%",
    paddingRight: "5%",
    borderRadius: 16,
    // backgroundColor: "rgba(0, 0, 0, 0.6)",
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  coverImage: {
    // marginTop: "-3%",
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

export default connect(mapStateToProps, mapDispatchToProps)(TripsScreen);
