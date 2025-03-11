import PropTypes from "prop-types";
import React, { Component } from "react";
import { MaterialIndicator } from "react-native-indicators";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Colors } from "../../assets/colors/color";
import Refer from "../../components/Refer/Refer";
import { setProfile } from "../../redux/actions/counts";

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
      const email = await globalThis.AsyncStorage.getItem("email");
      this.setState({ email: email });
      this.loadMySessions(this.state.email);
    } catch (error) {
      console.log(error);
      // Error retrieving data
    }
  };
  // loadMySessions(email, _callback) {
  //   email = this.state.email;
  //   var url = SERVER_URL + "/event/mySessions";
  //   axios
  //     .post(url, { email: email })
  //     .then((response) => {
  //       if (response.data) {
  //         //
  //         this.setState({ expiredEvents: response.data.expiredEvents });
  //         this.setState({ upcomingEvents: response.data.upcomingEvents });
  //         this.setState({ ongoingEvents: response.data.ongoingEvents });
  //         this.setState({ error: false });
  //         this.setState({ childLoader: false });

  //         _callback();
  //       }
  //     })
  //     .catch((error) => {
  //       this.error = true;
  //     });
  // }
  requestReferrals(_callback) {
    // fetching refferals
    ////console.log("In requestReferrals api");
    globalThis.axios
      .post(globalThis.SERVER_URL + "/user/referralsList", {
        from: this.props.profile.phoneNumber,
      })
      .then((response) => {
        ////console.log("referrals", JSON.stringify(response.data));
        _callback(response.data);
        ////console.log("api call ends successfully.")
      })
      .catch((error) => {
        ////console.log("referrals failed");
        globalThis.crashlytics().recordError(JSON.stringify(error));
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
    return (
      <Refer
        // loadMySessions={this.loadMySessions.bind(this)}
        navigation={this.props.navigation}
        ongoingEvents={this.state.ongoingEvents}
        upcomingEvents={this.state.upcomingEvents}
        expiredEvents={this.state.expiredEvents}
        requestReferrals={this.requestReferrals.bind(this)}
      />
    );
  }
}

ReferScreen.propTypes = {
  profile: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(ReferScreen);
