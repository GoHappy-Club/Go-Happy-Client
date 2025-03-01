import React, { Component } from "react";
//import axios from "axios";
import HomeDashboard from "../../components/HomeDashboard/HomeDashboard.js";
import WhatsAppFAB from "../../commonComponents/whatsappHelpButton.js";

import tambola from "tambola";
import Video from "react-native-video";
import { connect } from "react-redux";
import { setMembership, setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import GOHLoader from "../../commonComponents/GOHLoader.js";
import { View } from "react-native";
import { Colors } from "../../assets/colors/color.js";
import { fromUnixTime } from "date-fns";
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
      ratings: [],
    };
    crashlytics().log(JSON.stringify(props.propProfile));
    this._retrieveData();
    // alert(JSON.stringify(props));
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("email");
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      const selfInviteCode = await AsyncStorage.getItem("selfInviteCode");
      if (value !== null) {
        // We have data!!
        this.setState({ email: value });
        this.setState({ phoneNumber: phoneNumber });
        this.setState({ selfInviteCode: selfInviteCode });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

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
          this.setState({ whatsappLink: properties[0].whatsappHelpLink });
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
            ratings={this.state.ratings}
            childLoader={this.state.childLoader}
            bookEvent={this.bookEvent.bind(this)}
            loadEvents={this.loadEvents.bind(this)}
            navigation={this.props.navigation}
            deepId={this.props.route.params?.deepId}
            start={this.props.start}
            registerStep={this.props.registerStep}
            copilotEvents={this.props.copilotEvents}
          />
        </>
      );
    } else {
      // return (<MaterialIndicator color='black' style={{backgroundColor:"#00afb9"}}/>)
      return (
        // <ScrollView style={{ backgroundColor: Colors.white }}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.background,
          }}
        >
          <GOHLoader />
        </View>
        // </ScrollView>
      );
    }
  }
  loadEvents(selectedDate, midnightDate) {
    this.setState({ childLoader: true });
    this.setState({ events: [] });
    var url = SERVER_URL + "/event/getEventsByDate";
    if (selectedDate == null) {
      selectedDate = new Date().setHours(0, 0, 0, 0);
    }
    if (midnightDate == undefined || midnightDate == null) {
      const dt = fromUnixTime(selectedDate / 1000);
      dt.setHours(23, 59, 0, 0);
      midnightDate = dt.getTime();
    }

    axios
      .post(url, { date: selectedDate, midnightDate })
      .then((response) => {
        if (response.data) {
          for (var i = 0; i < response.data.events.length; i++) {
            response.data.events[i].loadingButton = false;
          }
          this.setState({
            events: response.data.events,
            ratings: response.data.ratings,
          });
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

  bookEvent(item, phoneNumber, selectedDate, playSound) {
    let ticket = tambola.generateTicket(); // This generates a standard Tambola Ticket
    if (phoneNumber == "" || phoneNumber == undefined) {
      phoneNumber = this.state.phoneNumber;
    }
    var id = item.id;
    var url = SERVER_URL + "/event/bookEvent";
    let { membership, actions } = this.props;

    axios
      .post(url, { id: id, phoneNumber: phoneNumber, tambolaTicket: ticket })
      .then((response) => {
        if (response.data) {
          if (response.data == "SUCCESS") {
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

            // deduct coins from user's membership data in redux
            if (
              (membership?.freeTrialActive != null ||
                membership?.freeTrialActive != undefined) &&
              membership.freeTrialActive != true
            ) {
              membership.coins = membership.coins - item.cost;
              actions.setMembership({ ...membership });
            }
            playSound();
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
  membership: state.membership.membership,
});
const ActionCreators = Object.assign({}, { setProfile, setMembership });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
