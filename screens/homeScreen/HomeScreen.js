import React, { Component } from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";
import axios from "axios";
import AwesomeAlert from "react-native-awesome-alerts";
import { MaterialIndicator } from "react-native-indicators";
import HomeDashboard from "../../components/HomeDashboard.js";

// var tambola = require('tambola-generator');
import tambola from "tambola";
import Video from "react-native-video";
import {
  EventNotification,
  EventReminderNotification,
} from "../../services/LocalPushController";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phoneNumber: "",
      password: "",
      showAlert: false,
      childLoader: false,
      events: [],
      error: true,
    };
    crashlytics().log(JSON.stringify(props.propProfile));
    // alert(JSON.stringify(props));
  }
  setPaymentData(phoneNumber, amount, _callback) {
    var url = SERVER_URL + "/user/setPaymentData";
    axios
      .post(url, { phoneNumber: phoneNumber, amount: amount })
      .then((response) => {
        // if (response.data) {
        AsyncStorage.setItem("amount", amount);
        // this.setProfile(planName);
        _callback();
        // }
      })
      .catch((error) => {
        this.error = true;
      });
  }

  async getOrderId(amount) {
    var url = SERVER_URL + "/razorPay/pay";
    try {
      const response = await axios.post(url, { amount: amount });
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      this.error = true;
      // throw new Error("Error getting order ID");
    }
  }

  render() {
    if (this.state.error == false) {
      return (
        <HomeDashboard
          events={this.state.events}
          childLoader={this.state.childLoader}
          bookEvent={this.bookEvent.bind(this)}
          loadEvents={this.loadEvents.bind(this)}
          navigation={this.props.navigation}
          getOrderId={this.getOrderId.bind(this)}
          setPaymentData={this.setPaymentData.bind(this)}
        />
      );
    } else {
      // return (<MaterialIndicator color='black' style={{backgroundColor:"#00afb9"}}/>)
      return (
        // <ScrollView style={{ backgroundColor: "white" }}>
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
        // </ScrollView>
      );
    }
  }
  loadEvents(selectedDate) {
    this.setState({ childLoader: true });
    this.setState({ events: [] });
    var url = SERVER_URL + "/event/getEventsByDate";
    if (selectedDate == null) {
      selectedDate = new Date().setHours(0, 0, 0, 0);
    }

    axios
      .post(url, { date: selectedDate })
      .then((response) => {
        if (response.data) {
          for (var i = 0; i < response.data.events.length; i++) {
            response.data.events[i].loadingButton = false;
          }
          this.setState({ events: response.data.events });
          this.setState({ error: false });
          this.setState({ childLoader: false });
        }
      })
      .catch((error) => {
        // alert("blablabla" + url + error);
        this.error = true;
      });
  }

  bookEvent(item, phoneNumber, selectedDate) {
    let ticket = tambola.generateTicket(); // This generates a standard Tambola Ticket

    var id = item.id;
    var url = SERVER_URL + "/event/bookEvent";

    axios
      .post(url, { id: id, phoneNumber: phoneNumber, tambolaTicket: ticket })
      .then((response) => {
        if (response.data) {
          if (response.data == "SUCCESS") {
            //EventNotification({channelId: 'events',event:item});
            EventReminderNotification({
              channelId: "events",
              event: item,
              fireTime: new Date(parseInt(item.startTime) - 1000 * 60 * 10),
              bigText: "Your session starts in a few minutes.",
            });
            EventReminderNotification({
              channelId: "events",
              event: item,
              fireTime: new Date(parseInt(item.startTime)),
              bigText: "Your session has been started. Join Now!",
            });
            var tempEvents = this.state.events;
            for (var i = 0; i < tempEvents.length; i++) {
              if (tempEvents[i].id == item.id) {
                tempEvents[i].seatsLeft = tempEvents[i].seatsLeft - 1;
                tempEvents[i].loadingButton = false;
                tempEvents[i].status = "Booked";
                this.setState({ events: tempEvents });
                break;
              }
            }
            this.loadEvents(selectedDate);
            // _callback();
            // item.seatsLeft = item.seatsLeft - 1;

            return item;
          }
        }
      })
      .catch((error) => {
        this.error = true;

        return false;
      });
  }
  componentDidMount() {
    this.loadEvents(new Date().setHours(0, 0, 0, 0));
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
