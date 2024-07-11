import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialIndicator } from "react-native-indicators";
import Refer from "../../components/Refer";
import { connect, useSelector } from "react-redux";
import { setProfile } from "../../redux/actions/counts";
import { bindActionCreators } from "redux";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReferScreen = (props) => {
  const [loader, setLoader] = useState(false);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [expiredEvents, setExpiredEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [email, setEmail] = useState("");

  const _retrieveData = async () => {
    try {
      const email = await AsyncStorage.getItem("email");
      if (email !== null) {
        setEmail(email);
        loadMySessions(email);
      }
    } catch (error) {
      // Error retrieving data
      console.log("error retreiving data",error);
    }
  };

  useEffect(() => {
    _retrieveData();
  }, []);

  const loadMySessions = async (email,_callback) => {
    email = email || email;
    var url = SERVER_URL + "/event/mySessions";
    try {
      const response = await axios.post(url, { email: email });
      if (response.data) {
        setExpiredEvents(response.data.expiredEvents);
        setUpcomingEvents(response.data.upcomingEvents);
        setOngoingEvents(response.data.ongoingEvents);

        _callback();
      }
    } catch (error) {
      console.log("error in event/mySsesisonf",error);
    }
  };

  const requestReferrals = async (_callback) => {
    try {
      const response = await axios.post(SERVER_URL + "/user/referralsList", {
        from: props.profile.phoneNumber,
      });
      _callback(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loader) {
    return (
      <MaterialIndicator color="white" style={{ backgroundColor: "#0A1045" }} />
    );
  }

  return (
    <Refer
      loadMySessions={loadMySessions}
      navigation={props.navigation}
      ongoingEvents={ongoingEvents}
      upcomingEvents={upcomingEvents}
      expiredEvents={expiredEvents}
      requestReferrals={requestReferrals}
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

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(ReferScreen);
