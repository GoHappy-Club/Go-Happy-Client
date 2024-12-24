import React, { Component } from "react";
//import axios from "axios";
import Video from "react-native-video";
import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import { ScrollView } from "react-native-gesture-handler";
import {
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";
import { Tab, TabView, Text } from "@rneui/themed";
import { View } from "react-native";
import Trip from "../../components/trips/Trip.js";
import { Colors } from "../../assets/colors/color.js";
import GOHLoader from "../../commonComponents/GOHLoader.js";

class TripDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      details: null,
      error: true,
      index: 0,
      vouchers:[]
    };
    crashlytics().log(JSON.stringify(props.propProfile));
    // alert(JSON.stringify(props));
  }

  async getTripDetails() {
    var url =
      SERVER_URL + "/trips/getDetails/" + this.props.route.params.id.trim() + "?phone="+this.props.profile.phoneNumber;
    //console.log(url);
    try {
      const response = await axios.get(url);
      if (response.data) {
        this.setState({
          details: response.data.details,
          error: false,
          vouchers: response.data.vouchers,
        });
      }
    } catch (error) {
      crashlytics().log(`Error in getTripDetails ${error} ${url}`)
      this.error = true;
      // throw new Error("Error getting order ID");
    }
  }

  componentDidMount() {
    this.getTripDetails();
  }

  render() {
    if (this.state.error == false) {
      return <Trip details={this.state.details} vouchers={this.state.vouchers} />;
    } else {
      // return (<MaterialIndicator color='black' style={{backgroundColor:"#00afb9"}}/>)
      return (
        // <ScrollView style={{ backgroundColor: Colors.white }}>
        <GOHLoader/>
        // </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.white,
  },
  textContainer: {
    padding: 16,
    marginTop: "auto",
    width: 200,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  coverImage: {
    marginTop: "-3%",
    width: "100%",
    flex: 0.5,
  },
});

const mapStateToProps = (state) => ({
  count: state.count.count,
  profile: state.profile.profile,
});
const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripDetailsScreen);
