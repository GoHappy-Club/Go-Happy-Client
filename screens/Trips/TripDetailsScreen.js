import PropTypes from "prop-types";
import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Colors } from "../../assets/colors/color.js";
import GOHLoader from "../../commonComponents/GOHLoader.js";
import Trip from "../../components/trips/Trip.js";
import { setProfile } from "../../redux/actions/counts.js";

class TripDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      details: null,
      error: true,
      index: 0,
      vouchers: [],
    };
    globalThis.crashlytics().log(JSON.stringify(props.propProfile));
    // alert(JSON.stringify(props));
  }

  async getTripDetails() {
    var url =
      globalThis.SERVER_URL +
      "/trips/getDetails/" +
      this.props.route.params.id.trim() +
      "?phone=" +
      this.props.profile.phoneNumber;
    //console.log(url);
    try {
      const response = await globalThis.axios.get(url);
      if (response.data) {
        this.setState({
          details: response.data.details,
          error: false,
          vouchers: response.data.vouchers,
        });
      }
    } catch (error) {
      globalThis.crashlytics().log(`Error in getTripDetails ${error} ${url}`);
      this.error = true;
      // throw new Error("Error getting order ID");
    }
  }

  componentDidMount() {
    this.getTripDetails();
  }

  render() {
    if (this.state.error == false) {
      return (
        <Trip details={this.state.details} vouchers={this.state.vouchers} />
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
}

TripDetailsScreen.propTypes = {
  propProfile: PropTypes.object,
  route: PropTypes.object,
  profile: PropTypes.object,
};

const mapStateToProps = (state) => ({
  count: state.count.count,
  profile: state.profile.profile,
});
const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripDetailsScreen);
