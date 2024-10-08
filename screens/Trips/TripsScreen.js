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
} from "react-native";
import { Tab, TabView, Text } from "@rneui/themed";
import { View } from "react-native";
import TripsList from "../../components/trips/TripsList.js";
import { Colors } from "../../assets/colors/color.js";

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
    };
    crashlytics().log(JSON.stringify(props.propProfile));
    // alert(JSON.stringify(props));
  }

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
      this.error = true;
      // throw new Error("Error getting order ID");
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
      // throw new Error("Error getting order ID");
    }
  }

  componentWillMount() {
    this.getPastTripsData();
    this.getUpcomingTripsData();
  }

  render() {
    if (this.state.error == true) {
      return (
        <View style={styles.mainContainer}>
          {/* <Text>My Trips</Text> */}

          <ImageBackground
            source={{
              uri: "https://storage.googleapis.com/gohappy-main-bucket/Assets/trip_cover.jpeg",
            }}
            style={styles.coverImage}
            resizeMode="cover"
          >
            <View style={styles.textContainer}>
              <Text style={styles.coverTitle}>TRIPS</Text>
            </View>
          </ImageBackground>
          <Tab
            value={this.state.index}
            onChange={(index) => {
              this.setState({ index: index });
            }}
            dense
          >
            <Tab.Item>Upcoming</Tab.Item>
            <Tab.Item>Past</Tab.Item>
          </Tab>
          <TabView
            containerStyle={{ height: "100%" }}
            value={this.state.index}
            onChange={(index) => {
              this.setState({ index: index });
            }}
            animationType="spring"
          >
            <TabView.Item style={{ width: "100%", height: "100%" }}>
              <TripsList
                trips={this.state.upcomingTrips}
                navigation={this.props.navigation}
              />
            </TabView.Item>
            <TabView.Item style={{ width: "100%", height: "100%" }}>
              <TripsList
                type="past"
                trips={this.state.pastTrips}
                navigation={this.props.navigation}
              />
            </TabView.Item>
          </TabView>
          {/* </ScrollView> */}
        </View>
      );
    } else {
      // return (<MaterialIndicator color='black' style={{backgroundColor:"#00afb9"}}/>)
      return (
        // <ScrollView style={{ backgroundColor: Colors.white }}>
        <Video
          source={require("../../images/logo_splash.mp4")}
          style={{
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
          }}
          muted={true}
          repeat={true}
          resizeMode="cover"
        />
        // </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.white,
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
    marginTop: "-3%",
    width: "100%",
    flex: 0.5,
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
