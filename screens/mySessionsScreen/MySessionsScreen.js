import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIndicator } from "react-native-indicators";
import MySessions from "../../components/MySessions";
import { Colors } from "../../assets/colors/color";
import Video from "react-native-video";
import GOHLoader from "../../commonComponents/GOHLoader";

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
    this.setState({ loading: true });
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
        console.log("Error in sessions =>", error);
        this.setState({ loading: false });
        this.error = true;
      });
  }
  render() {
    if (this.state.loading == true) {
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
