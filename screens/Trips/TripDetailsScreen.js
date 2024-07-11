import React, { useState, useEffect } from "react";
import axios from "axios";
import Video from "react-native-video";
import { useSelector } from "react-redux";
import { StyleSheet } from "react-native";
import Trip from "../../components/trips/Trip.js";

const TripDetailsScreen = (props) => {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(true);
  
  const profile = useSelector(state => state.profile.profile);

  useEffect(() => {
    crashlytics().log(JSON.stringify(profile));
    getTripDetails();
  }, []);

  const getTripDetails = async () => {
    const url = SERVER_URL + "/trips/getDetails/" + props.route.params.id.trim();
    try {
      const response = await axios.get(url);
      if (response.data) {
        setDetails(response.data.details);
        setError(false);
      }
    } catch (error) {
      setError(true);
      // Handle error
    }
  };

  if (!error) {
    return <Trip details={details} />;
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
});

export default TripDetailsScreen;