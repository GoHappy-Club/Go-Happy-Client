import React, { Component } from "react";
import PushNotification from "react-native-push-notification";
import Video from "react-native-video";
import { Linking, StyleSheet } from "react-native";
// import { Container, Header, Content, Left, Body, Right, Icon, Title, Form, Item, Input, Label } from 'native-base';
import SessionDetails from "../../components/SessionDetails";
import tambola from "tambola";
import { getEvent } from "../../services/events/EventService";

export default class HomeDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      event: null,
      loader: true,
    };
    this._retrieveData();
    if (this.props.route.params.deepId) {
      this.getEventDetails(this.props.route.params.deepId);
    }
  }
  componentDidUpdate() {
    if (this.props.route.params.deepId != this.state.event?.id) {
      this.getEventDetails(this.props.route.params.deepId);
    }
  }
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("email");
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      const selfInviteCode = await AsyncStorage.getItem("selfInviteCode");
      if (phoneNumber !== null) {
        // We have data!!
        this.setState({ email: value });
        this.setState({ phoneNumber: phoneNumber });
        this.setState({ selfInviteCode: selfInviteCode });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  getEventDetails(id) {
    // this.setState({event:null})
    this.state.loader = true;
    getEvent(id)
      .then((response) => {
        this.setState({ event: response.data.event, loader: false });
      })
      .catch((error) => {
        console.log(error);
        crashlytics().recordError(JSON.stringify(error));
      });
  }

  sessionAction(par, _callback) {
    var type = this.props.route.params.type;
    var phoneNumber = this.state.phoneNumber;
    if (type == null) {
      type = par;
    }
    if (type == "expired") {
      var meetingLink = this.state.event.meetingLink;
      if (meetingLink == null) {
        return;
      }
      var si = meetingLink.indexOf("/j/") + 3;
      var ei = meetingLink.indexOf("?");
      var meetingId = meetingLink.substring(si, ei);

      axios
        .post(SERVER_URL + "/zoom/getRecording", { meetingId: meetingId })
        .then((response) => {
          if (response.data) {
            Linking.canOpenURL(response.data).then((supported) => {
              if (supported) {
                Linking.openURL(response.data);
              } else {
              }
            });
          }
        })
        .catch((error) => {
          crashlytics().recordError(JSON.stringify(error));
          this.error = true;
        });
    } else if (type == "ongoing") {
      Linking.openURL(this.state.event.meetingLink);
    } else if (
      this.state.event.participantList != null &&
      this.state.event.participantList.includes(phoneNumber)
    ) {
      //cancel a notification
      var url = SERVER_URL + "/event/cancelEvent";
      axios
        .post(url, {
          id: this.state.event.id,
          phoneNumber: phoneNumber,
        })
        .then((response) => {
          if (response.data) {
            if (this.props.route.params.onGoBack) {
              this.props.route.params.onGoBack();
              return;
            }
            if (this.props.navigation.canGoBack()) {
              this.props.navigation.goBack();
              return;
            } else {
              this.props.navigation.replace("GoHappy Club");
              return;
            }
          }
        })
        .catch((error) => {
          crashlytics().recordError(JSON.stringify(error));
          this.error = true;
        });
    } else if (type == "book") {
      let ticket = tambola.generateTicket(); // This generates a standard Tambola Ticket

      var url = SERVER_URL + "/event/bookEvent";
      var id = this.state.event.id;
      axios
        .post(url, { id: id, phoneNumber: phoneNumber, tambolaTicket: ticket })
        .then((response) => {
          if (response.data) {           
            if (response.data == "SUCCESS") {
              if (this.props.route.params.onGoBack) {
                this.props.route.params.onGoBack();
                return;
              }
              
              if (this.props.navigation.canGoBack()) {
                this.props.navigation.goBack();
                return;
              } else {
                this.props.navigation.replace("GoHappy Club");
                return;
              }
              // _callback();
              return response.data;

              // item.seatsLeft = item.seatsLeft - 1
            }
          }
        })
        .catch((error) => {
          crashlytics().recordError(JSON.stringify(error));
          this.error = true;

          return false;
        });
    }
  }

  render() {
    if (this.state.loader == true) {
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
    return (
      this.state.event && (
        <SessionDetails
          navigation={navigation}
          sessionAction={this.sessionAction.bind(this)}
          event={this.state.event}
          type={this.props.route.params.type}
          phoneNumber={this.state.phoneNumber}
          selfInviteCode={this.state.selfInviteCode}
          alreadyBookedSameDayEvent={
            this.props.route.params.alreadyBookedSameDayEvent
          }
        />
      )
    );
  }
}

const styles = StyleSheet.create({});
