import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { MaterialIndicator } from "react-native-indicators";
import MySessions from "../../components/MySessions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const MySessionsScreen = ({ navigation, propProfile }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loader, setLoader] = useState(false);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [expiredEvents, setExpiredEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = async () => {
    try {
      const storedPhoneNumber = await AsyncStorage.getItem("phoneNumber");
      setPhoneNumber(storedPhoneNumber);
      loadMySessions(storedPhoneNumber);
    } catch (error) {
      // Error retrieving data
    }
  };

  const loadMySessions = (phoneNumber, _callback = () => {}) => {
    const url = SERVER_URL + "/event/mySessions";
    axios
      .post(url, { phoneNumber: phoneNumber })
      .then((response) => {
        if (response.data) {
          setExpiredEvents(response.data.expiredEvents);
          setUpcomingEvents(response.data.upcomingEvents);
          setOngoingEvents(response.data.ongoingEvents);
          setError(false);
          setLoader(false);
          _callback();
        }
      })
      .catch((error) => {
        setError(true);
      });
  };

  if (loader) {
    return (
      <MaterialIndicator
        color="white"
        style={{ backgroundColor: "#0A1045" }}
      />
    );
  }

  return (
    <MySessions
      loadMySessions={loadMySessions}
      navigation={navigation}
      ongoingEvents={[]}
      upcomingEvents={[]}
      expiredEvents={expiredEvents}
      phoneNumber={phoneNumber}
      profile={propProfile.profile}
    />
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "#0A1045",
  },
  input: {
    width: "90%",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  userBtn: {
    backgroundColor: "#f0ad4e",
    paddingVertical: 15,
    height: 60,
  },
  btnTxt: {
    fontSize: 20,
    textAlign: "center",
    color: "black",
    fontWeight: "700",
  },
  registerTxt: {
    marginTop: 5,
    fontSize: 15,
    textAlign: "center",
    color: "white",
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    margin: 10,
    color: "white",
  },
  logo: {
    width: 150,
    height: 150,
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {},
  title: {
    color: "white",
    marginTop: 10,
    width: 160,
    opacity: 0.9,
    textAlign: "center",
  },
  newinput: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 10,
    color: "white",
    paddingHorizontal: 10,
  },
  container2: {
    padding: 25,
  },
  title2: {
    color: "white",
    marginTop: "30%",
    marginBottom: 10,
    opacity: 0.9,
    textAlign: "center",
    fontSize: 30,
  },
});

export default MySessionsScreen;