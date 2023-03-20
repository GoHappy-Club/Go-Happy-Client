import React, { Component } from 'react';
import PushNotification from 'react-native-push-notification';

import {
  Button,
  Image,
  KeyboardAvoidingView,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
// import { Container, Header, Content, Left, Body, Right, Icon, Title, Form, Item, Input, Label } from 'native-base';
import { MaterialIndicator } from 'react-native-indicators';
import SessionDetails from '../../components/SessionDetails';
import tambola from 'tambola';

export default class HomeDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
    this._retrieveData();
    // alert("ble;" + JSON.stringify(props));
  }
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('email');

      if (value !== null) {
        // We have data!!
        this.setState({ email: value });
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  sessionAction(par) {
    var type = this.props.route.params.type;
    var phoneNumber = this.props.route.params.phoneNumber;
    if (type == null) {
      type = par;
    }

    if (type == 'expired') {
      var meetingLink = this.props.route.params.event.meetingLink;
      if (meetingLink == null) {
        return;
      }
      var si = meetingLink.indexOf('/j/') + 3;
      var ei = meetingLink.indexOf('?');
      var meetingId = meetingLink.substring(si, ei);

      axios
        .post(SERVER_URL + '/zoom/getRecording', { meetingId: meetingId })
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
    } else if (type == 'ongoing') {
      Linking.openURL(this.props.route.params.event.meetingLink);
    } else if (
      this.props.route.params.event.participantList != null &&
      this.props.route.params.event.participantList.includes(phoneNumber)
    ) {
      //cancel a notification
      var url = SERVER_URL + '/event/cancelEvent';
      axios
        .post(url, {
          id: this.props.route.params.event.id,
          phoneNumber: this.props.route.params.phoneNumber,
        })
        .then((response) => {
          if (response.data) {
            PushNotification.cancelLocalNotifications({
              id: String(this.props.route.params.event.id),
            });
            //recomended by Viual Studio
            //PushNotification.cancelLocalNotification({id: String(this.props.route.params.event.id)});
            this.props.route.params.onGoBack();
            // this.props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();
          }
        })
        .catch((error) => {
          crashlytics().recordError(JSON.stringify(error));
          this.error = true;
        });
    } else if (type == 'book') {
      let ticket = tambola.generateTicket(); // This generates a standard Tambola Ticket

      var url = SERVER_URL + '/event/bookEvent';
      var phoneNumber = this.props.route.params.phoneNumber;
      var id = this.props.route.params.event.id;
      axios
        .post(url, { id: id, phoneNumber: phoneNumber, tambolaTicket: ticket })
        .then((response) => {
          if (response.data) {
            if (response.data == 'SUCCESS') {
              this.props.route.params.onGoBack();
              this.props.navigation.goBack();
              return response.data;
              // _callback();
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
      // return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
      return (
        <MaterialIndicator
          color="white"
          style={{ backgroundColor: '#0A1045' }}
        />
      );
    }
    const navigation = this.props.navigation;
    const title = 'Login';
    return (
      <SessionDetails
        navigation={navigation}
        sessionAction={this.sessionAction.bind(this)}
        event={this.props.route.params.event}
        type={this.props.route.params.type}
        phoneNumber={this.props.route.params.phoneNumber}
        profile={this.props.route.params.profile}
        alreadyBookedSameDayEvent={
          this.props.route.params.alreadyBookedSameDayEvent
        }
      />
    );
  }
}

const styles = StyleSheet.create({});
