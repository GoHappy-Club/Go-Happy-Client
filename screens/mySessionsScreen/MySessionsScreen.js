import React, { Component } from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// import { Container, Header, Content, Left, Body, Right, Icon, Title, Form, Item, Input, Label } from 'native-base';
import { MaterialIndicator } from "react-native-indicators";
import MySessions from "../../components/MySessions";

export default class MySessionsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      password: "",
      showAlert: false,
      loader: false,
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
  loadMySessions(phoneNumber, _callback) {
    phoneNumber = this.state.phoneNumber;
    var url = SERVER_URL + "/event/mySessions";
    axios
      .post(url, { phoneNumber: phoneNumber })
      .then((response) => {
        if (response.data) {
          //
          this.setState({ expiredEvents: response.data.expiredEvents });
          this.setState({ upcomingEvents: response.data.upcomingEvents });
          this.setState({ ongoingEvents: response.data.ongoingEvents });
          this.setState({ error: false });
          this.setState({ childLoader: false });

          _callback();
        }
      })
      .catch((error) => {
        this.error = true;
      });
  }
  render() {
    if (this.state.loader == true) {
      // return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
      return (
        <MaterialIndicator
          color="white"
          style={{ backgroundColor: "#0A1045" }}
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
