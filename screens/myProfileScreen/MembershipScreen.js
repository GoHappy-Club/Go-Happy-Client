import PropTypes from "prop-types";
import React, { Component } from "react";
import { MaterialIndicator } from "react-native-indicators";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Colors } from "../../assets/colors/color.js";
import Membership from "../../components/Contribution/Contribution";
import { setProfile } from "../../redux/actions/counts.js";

class MembershipScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      password: "",
      showAlert: false,
      loader: false,
      orderId: "",
    };
    // alert(JSON.stringify(props));
  }
  setProfile(amount) {
    let { profile, actions } = this.props;
    profile.amount = amount;
    profile.lastPaymentDate = new Date().getTime();
    actions.setProfile(profile);
    //console.log("this is the profile", profile);
  }
  setPaymentData(id, phoneNumber, amount, _callback) {
    var url = globalThis.SERVER_URL + "/user/setPaymentData";
    globalThis.axios
      .post(url, { id: id, phoneNumber: phoneNumber, amount: amount })
      .then(() => {
        // if (response.data) {
        globalThis.AsyncStorage.setItem("amount", amount);
        this.setProfile(amount);
        _callback();
        // }
      })
      .catch(() => {
        this.error = true;
      });
  }
  render() {
    if (this.state.loader == true) {
      return (
        <MaterialIndicator
          color={Colors.white}
          style={{ backgroundColor: Colors.materialIndicatorColor }}
        />
      );
    }
    return (
      <Membership
        navigation={this.props.navigation}
        // setMembership={this.setMembership.bind(this)}
        setPaymentData={this.setPaymentData.bind(this)}
      />
    );
  }
}

MembershipScreen.propTypes = {
  profile: PropTypes.object,
  navigation: PropTypes.object,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MembershipScreen);
