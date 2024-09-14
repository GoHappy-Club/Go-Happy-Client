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
import Refer from "../../components/Refer";
import { connect, useSelector } from "react-redux";
import { setProfile } from "../../redux/actions/counts";
import { bindActionCreators } from "redux";
import { Colors } from "../../assets/colors/color";
class ReferScreen extends Component {
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
      const email = await AsyncStorage.getItem("email");
      this.setState({ email: email });
      this.loadMySessions(this.state.email);
    } catch (error) {
      // Error retrieving data
    }
  };
  loadMySessions(email, _callback) {
    email = this.state.email;
    var url = SERVER_URL + "/event/mySessions";
    axios
      .post(url, { email: email })
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
  requestReferrals(_callback) {
    // fetching refferals
    ////console.log("In requestReferrals api");
    axios
      .post(SERVER_URL + "/user/referralsList", {
        from: this.props.profile.phoneNumber,
      })
      .then((response) => {
        ////console.log("referrals", JSON.stringify(response.data));
        _callback(response.data);
        ////console.log("api call ends successfully.")
      })
      .catch((error) => {
        ////console.log("referrals failed");
        crashlytics().recordError(JSON.stringify(error));
        this.error = true;
      });
  }
  render() {
    if (this.state.loader == true) {
      // return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
      return (
        <MaterialIndicator
          color={Colors.white}
          style={{ backgroundColor: Colors.materialIndicatorColor }}
        />
      );
    }
    const navigation = this.props.navigation;
    const title = "Login";
    return (
      <Refer
        loadMySessions={this.loadMySessions.bind(this)}
        navigation={this.props.navigation}
        ongoingEvents={this.state.ongoingEvents}
        upcomingEvents={this.state.upcomingEvents}
        expiredEvents={this.state.expiredEvents}
        requestReferrals={this.requestReferrals.bind(this)}
      />
    );
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

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(ReferScreen);
