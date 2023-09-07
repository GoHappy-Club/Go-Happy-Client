import React, { Component } from "react";
import { Card, Divider } from "react-native-paper";
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Skeleton } from "@rneui/themed";
import {
  calculateDaysAndNights,
  loadDate,
  loadShortDate,
  trimContent,
} from "../commonComponents/helpers";
import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { setProfile } from "../redux/actions/counts.js";
class Trip extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderRow = ({ item, index }) => (
    <TouchableOpacity>
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: item.coverImages[0] }}
          style={styles.image}
        >
          <Text style={styles.text}>{trimContent(item.location, 13)}</Text>
          <Text style={styles.subText}>{loadDate(item.startTime)}</Text>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );

  render() {
    console.log(this.props.route);
    const info = this.props.info;
    return (
      <View style={styles.scrollContainer}>
        <ImageBackground
          source={{
            uri: info.coverImages[0],
          }}
          style={styles.mainImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          {/* <View style={styles.textContainer}> */}
          <View style={styles.box}>
            <Text style={styles.coverTitle}>{info.title}</Text>
            <Text style={styles.cities}>{info.cities.join(" | ")}</Text>
            <View style={styles.datesView}>
              <FontAwesomeIcon
                icon={faCalendarWeek}
                color={"#e8e4e3"}
                size={25}
                style={{ alignSelf: "center" }}
              />
              <Text style={styles.dates}>
                {loadShortDate(info.startTime)} - {loadShortDate(info.endTime)}
              </Text>
            </View>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Text style={styles.dayNight}>
                {calculateDaysAndNights(info.startTime, info.endTime)} /-
              </Text>
            </View>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Text style={styles.priceView}>Price: Rs. {info.cost} /-</Text>
            </View>
          </View>
          {/* </View> */}
        </ImageBackground>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  textContainer: {
    padding: 16,
    marginTop: "auto",
    width: 200,
  },
  box: {
    marginTop: "25%",
    marginLeft: "5%",
  },
  coverTitle: {
    fontSize: 36,
    color: "white",
  },
  cities: {
    fontSize: 24,
    color: "#e8e4e3",
  },
  datesView: {
    display: "flex",
    flexDirection: "row",
    marginTop: "1%",
  },
  dates: {
    fontSize: 18,
    color: "#e8e4e3",
    marginLeft: "2%",
  },
  dayNight: {
    fontSize: 28,
    marginTop: "10%",
    backgroundColor: "white",
    padding: 4,
    color: "black",
    borderRadius: 4,
  },
  priceView: {
    fontSize: 28,
    marginTop: "10%",
    backgroundColor: "white",
    padding: 4,
    color: "black",
    borderRadius: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  mainImage: {
    flex: 0.8,
    // tintColor: "black",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity value as needed
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

export default connect(mapStateToProps, mapDispatchToProps)(Trip);
