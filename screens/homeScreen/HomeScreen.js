import React, { Component } from "react";
import axios from "axios";
import HomeDashboard from "../../components/HomeDashboard.js";
import WhatsAppFAB from "../../commonComponents/whatsappHelpButton.js";
// var tambola = require('tambola-generator');
import tambola from "tambola";
import Video from "react-native-video";
import { EventReminderNotification } from "../../services/LocalPushController";
import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phoneNumber: "",
      password: "",
      showAlert: false,
      childLoader: false,
      events: [],
      error: true,
      whatsappLink: "",
    };
    crashlytics().log(JSON.stringify(props.propProfile));
    // alert(JSON.stringify(props));
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

  async getProperties() {
    var url = SERVER_URL + "/properties/list";
    const redux_profile = this.props.profile;
    try {
      const response = await axios.get(url);
      if (response.data) {
        const properties = response.data.properties;
        if (properties && properties.length > 0 && redux_profile) {
          redux_profile.properties = properties[0];
          actions.setProfile(redux_profile);
          this.setState({ whatsappLink: properties[0].whatsappLink });
        }
      }
    } catch (error) {
      this.error = true;
      // throw new Error("Error getting order ID");
    }
  }

  render() {
    if (this.state.error == false) {
      return (
        <>
          <HomeDashboard
            events={this.state.events}
            childLoader={this.state.childLoader}
            bookEvent={this.bookEvent.bind(this)}
            loadEvents={this.loadEvents.bind(this)}
            navigation={this.props.navigation}
            getOrderId={this.getOrderId.bind(this)}
          />
          <WhatsAppFAB
            url={
              this.props.profile.properties
                ? this.props.profile.properties.whatsappLink
                : this.state.whatsappLink
            }
          />
        </>
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
        this.getProperties();
      })
      .catch((error) => {
        // alert("blablabla" + url + error);
        this.error = true;
        this.getProperties();
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

const mapStateToProps = (state) => ({
  count: state.count.count,
  profile: state.profile.profile,
});
const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
