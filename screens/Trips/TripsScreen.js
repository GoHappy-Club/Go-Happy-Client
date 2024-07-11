import React, { useState, useEffect } from "react";
import axios from "axios";
import Video from "react-native-video";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  ImageBackground,
  View,
} from "react-native";
import { Tab, TabView, Text } from "@rneui/themed";
import TripsList from "../../components/trips/TripsList.js";

const TripsScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [pastTrips, setPastTrips] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [error, setError] = useState(true);

  const profile = useSelector(state => state.profile.profile);

  useEffect(() => {
    crashlytics().log(JSON.stringify(profile));
    getPastTripsData();
    getUpcomingTripsData();
  }, []);

  const getPastTripsData = async () => {
    const url = SERVER_URL + "/trips/past";
    try {
      const response = await axios.get(url);
      if (response.data) {
        setPastTrips(response.data.trips);
      }
    } catch (error) {
      setError(true);
    }
  };

  const getUpcomingTripsData = async () => {
    const url = SERVER_URL + "/trips/upcoming";
    try {
      const response = await axios.get(url);
      if (response.data) {
        setUpcomingTrips(response.data.trips);
      }
    } catch (error) {
      setError(true);
    }
  };

  if (error) {
    return (
      <View style={styles.mainContainer}>
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
          value={index}
          onChange={(newIndex) => setIndex(newIndex)}
          dense
        >
          <Tab.Item>Upcoming</Tab.Item>
          <Tab.Item>Past</Tab.Item>
        </Tab>
        <TabView
          containerStyle={{ height: "100%" }}
          value={index}
          onChange={(newIndex) => setIndex(newIndex)}
          animationType="spring"
        >
          <TabView.Item style={{ width: "100%", height: "100%" }}>
            <TripsList
              trips={upcomingTrips}
              navigation={navigation}
            />
          </TabView.Item>
          <TabView.Item style={{ width: "100%", height: "100%" }}>
            <TripsList
              type="past"
              trips={pastTrips}
              navigation={navigation}
            />
          </TabView.Item>
        </TabView>
      </View>
    );
  } else {
    return (
      <Video
        source={require("../../images/logo_splash.mp4")}
        style={styles.video}
        muted={true}
        repeat={true}
        resizeMode="cover"
      />
    );
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  textContainer: {
    padding: 16,
    marginTop: "auto",
    alignSelf: "flex-start",
  },
  coverTitle: {
    paddingLeft: "5%",
    paddingRight: "5%",
    borderRadius: 16,
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
  video: {
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
  },
});

export default TripsScreen;