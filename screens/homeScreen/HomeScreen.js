import React, { Component } from "react";
//import axios from "axios";
import HomeDashboard from "../../components/HomeDashboard.js";
import WhatsAppFAB from "../../commonComponents/whatsappHelpButton.js";
// var tambola = require('tambola-generator');
import tambola from "tambola";
import Video from "react-native-video";
import { connect } from "react-redux";
import { setMembership, setProfile } from "../../redux/actions/counts.js";
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
            childLoader={this.state.childLoader}
            bookEvent={this.bookEvent.bind(this)}
            loadEvents={this.loadEvents.bind(this)}
            navigation={this.props.navigation}
            deepId={this.props.route.params?.deepId}
            start={this.props.start}
            registerStep={this.props.registerStep}
            copilotEvents={this.props.copilotEvents}
          />
          {this.props.profile.age == null || this.props.profile.age > 50 ? (
            <WhatsAppFAB />
          ) : null}
        </>
      );
    } else {
      // return (<MaterialIndicator color='black' style={{backgroundColor:"#00afb9"}}/>)
      return (
        // <ScrollView style={{ backgroundColor: Colors.white }}>
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
    if (phoneNumber == "" || phoneNumber == undefined) {
      phoneNumber = this.state.phoneNumber;
    }
    //console.log('phone is', phoneNumber)
    var id = item.id;
    var url = SERVER_URL + "/event/bookEvent";
    let {membership,actions} = this.props;
    

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
            membership.coins = membership.coins - item.cost;
            actions.setMembership(membership);

            this.loadEvents(selectedDate);
            // _callback();
            // item.seatsLeft = item.seatsLeft - 1;

            return item;
          }
        }
      })
      .catch((error) => {
        this.error = true;
        //console.log('error is ',error, id, phoneNumber )
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
  membership : state.membership.membership,
});
const ActionCreators = Object.assign({}, { setProfile,setMembership });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
