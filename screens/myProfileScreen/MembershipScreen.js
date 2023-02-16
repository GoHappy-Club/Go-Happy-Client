import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { MaterialIndicator } from "react-native-indicators";
import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import Membership from "../../components/Membership";

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
  getOrderId(amount) {
    var url = SERVER_URL + "/razorPay/pay";

    axios
      .post(url, { amount: amount })
      .then((response) => {
        if (response.data) {
          this.setState({ orderId: response.data });
          return response.data;
        }
      })
      .catch((error) => {
        this.error = true;
      });
  }
  setProfile(plan) {
    let { profile, actions } = this.props;
    profile.membership = plan;
    actions.setProfile(profile);
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
  render() {
    const { profile } = this.props;
    if (this.state.loader == true) {
      return (
        <MaterialIndicator
          color="white"
          style={{ backgroundColor: "#0A1045" }}
        />
      );
    }
    const navigation = this.props.navigation;
    const title = "Login";
    return (
      <Membership
        navigation={this.props.navigation}
        getOrderId={this.getOrderId.bind(this)}
        setPaymentData={this.setPaymentData.bind(this)}
      />
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MembershipScreen);
