import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { MaterialIndicator } from "react-native-indicators";
import MySessions from "../../components/MySessions";
import { Colors } from "../../assets/colors/color";
import Video from "react-native-video";

export default class MySessionsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      password: "",
      showAlert: false,
      loading: false,
      ongoingEvents: [],
      expiredEvents: [],
      upcomingEvents: [],
      email: "",
    };
    this._retrieveData();
  }
  _retrieveData = async () => {
    try {
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      this.setState({ phoneNumber: phoneNumber });
      this.loadMySessions(this.state.phoneNumber);
    } catch (error) {
      // Error retrieving data
    }
  };
  /**
   * Loads the user's sessions from the server.
   *
   * @param {string} phoneNumber - The phone number of the user.
   * @param {function} _callback - A callback function to be executed after the data is loaded.
   */
  loadMySessions(phoneNumber, _callback) {
    phoneNumber = this.state.phoneNumber;
    var url = SERVER_URL + "/event/mySessions";
    this.setState({loading:true});
    axios
      .post(url, { phoneNumber: phoneNumber })
      .then((response) => {
        if (response.data) {
          this.setState({ expiredEvents: response.data.expiredEvents });
          this.setState({ error: false });
          
          _callback();
        }
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log("Error in sessions =>",error);
        this.setState({ loading: false });
        this.error = true;
      });
  }
  render() {
    if (this.state.loading == true) {
      return (
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
      );
    }
    const navigation = this.props.navigation;
    const title = "Login";
    return (
      <MySessions
        loadMySessions={this.loadMySessions.bind(this)}
        navigation={this.props.navigation}
        ongoingEvents={[]}
        upcomingEvents={[]}
        expiredEvents={this.state.expiredEvents}
        phoneNumber={this.state.phoneNumber}
        profile={this.props.propProfile.profile}
      />
    );
  }
  componentDidMount() {
    // this.loadMySessions(this.state.email);
  }
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: Colors.materialIndicatorColor,
  },
  input: {
    width: "90%",
    backgroundColor: Colors.white,
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
    color: Colors.black,
    fontWeight: "700",
  },
  registerTxt: {
    marginTop: 5,
    fontSize: 15,
    textAlign: "center",
    color: Colors.white,
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    margin: 10,
    color: Colors.white,
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
    color: Colors.white,
    marginTop: 10,
    width: 160,
    opacity: 0.9,
    textAlign: "center",
  },
  newinput: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 10,
    color: Colors.white,
    paddingHorizontal: 10,
  },
  container2: {
    padding: 25,
  },
  title2: {
    color: Colors.white,
    marginTop: "30%",
    marginBottom: 10,
    opacity: 0.9,
    textAlign: "center",
    fontSize: 30,
  },
});
