import PropTypes from "prop-types";
import React, { Component } from "react";
import { Linking, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import tambola from "tambola";

import { Colors } from "../../assets/colors/color";
import GOHLoader from "../../commonComponents/GOHLoader";
import SessionDetails from "../../components/SessionDetails/SessionDetails";
import { getDiscountValue } from "../../helpers/transactions";
import { setMembership, setProfile } from "../../redux/actions/counts";
import { getEvent } from "../../services/events/EventService";

class HomeDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      event: null,
      loader: true,
      resulatantCost: 0,
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
      const value = await globalThis.AsyncStorage.getItem("email");
      const phoneNumber = await globalThis.AsyncStorage.getItem("phoneNumber");
      const selfInviteCode =
        await globalThis.AsyncStorage.getItem("selfInviteCode");
      if (phoneNumber !== null) {
        // We have data!!
        this.setState({ email: value });
        this.setState({ phoneNumber: phoneNumber });
        this.setState({ selfInviteCode: selfInviteCode });
      }
    } catch (error) {
      console.log(error);
      // Error retrieving data
    }
  };

  getEventDetails(id) {
    // this.setState({event:null})
    this.setState({ loader: true });
    getEvent(id, this.state.phoneNumber)
      .then((response) => {
        this.setState({
          event: response.data.event,
          loader: false,
          resulatantCost: response.data.event.cost,
        });
      })
      .catch((error) => {
        console.log(error);
        globalThis.crashlytics().recordError(JSON.stringify(error));
      });
  }

  sessionAction(par, voucher = null) {
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

      globalThis.axios
        .post(globalThis.SERVER_URL + "/zoom/getRecording", {
          meetingId: meetingId,
        })
        .then((response) => {
          if (response.data) {
            Linking.canOpenURL(response.data).then((supported) => {
              if (supported) {
                Linking.openURL(response.data);
              }
            });
          }
        })
        .catch((error) => {
          globalThis.crashlytics().recordError(JSON.stringify(error));
          this.error = true;
        });
    } else if (type == "ongoing") {
      Linking.openURL(this.state.event.meetingLink);
    } else if (
      this.state.event.participantList != null &&
      this.state.event.participantList.includes(phoneNumber)
    ) {
      //cancel a notification
      var url = globalThis.SERVER_URL + "/event/cancelEvent";
      globalThis.axios
        .post(url, {
          id: this.state.event.id,
          phoneNumber: phoneNumber,
        })
        .then((response) => {
          if (response.data) {
            //refund coins to user's membership
            let { membership, actions } = this.props;
            if (
              (membership?.freeTrialActive != null ||
                membership?.freeTrialActive != undefined) &&
              membership.freeTrialActive != true
            ) {
              membership.coins = membership.coins + this.state.event.cost;
              actions.setMembership({ ...membership });
            }
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
          globalThis.crashlytics().recordError(JSON.stringify(error));
          this.error = true;
        });
    } else if (type == "book") {
      let ticket = tambola.generateTicket(); // This generates a standard Tambola Ticket

      const url = globalThis.SERVER_URL + "/event/bookEvent";
      var id = this.state.event.id;
      globalThis.axios
        .post(url, {
          id: id,
          phoneNumber: phoneNumber,
          tambolaTicket: ticket,
          voucherId: voucher?.voucherId,
        })
        .then((response) => {
          if (response.data) {
            if (response.data == "SUCCESS") {
              console.log(voucher);

              // deduct coins from user's membership data in redux
              let { membership, actions } = this.props;
              if (
                (membership?.freeTrialActive != null ||
                  membership?.freeTrialActive != undefined) &&
                membership.freeTrialActive != true
              ) {
                membership.coins =
                  membership.coins -
                  (this.state.event.cost -
                    getDiscountValue(voucher, this.state.event));
                actions.setMembership({ ...membership });
              }
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
          }
        })
        .catch((error) => {
          globalThis.crashlytics().recordError(JSON.stringify(error));
          this.error = true;

          return false;
        });
    }
  }

  render() {
    if (this.state.loader == true) {
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
          setResultantCost={(cost) => this.setState({ resulatantCost: cost })}
        />
      )
    );
  }
}

HomeDetailsScreen.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
  actions: PropTypes.object,
  profile: PropTypes.object,
  membership: PropTypes.object,
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  membership: state.membership.membership,
});

const ActionCreators = Object.assign({}, { setProfile, setMembership });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeDetailsScreen);
