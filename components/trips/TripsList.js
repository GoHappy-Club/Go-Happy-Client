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
  Linking,
} from "react-native";
import { Text } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Skeleton } from "@rneui/themed";
import { loadDate, trimContent } from "../../commonComponents/helpers";
import { Colors } from "../../constants/Colors";

class TripsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  calculateDaysNights(details) {
    const timeDifference = Math.abs(details.endTime - details.startTime);
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference + " Days / " + (daysDifference - 1) + " Nights";
  }

  render() {
    const renderRow = ({ item }) => (
      <TouchableOpacity
        onPress={() => {
          if (this.props.type == "past") {
            Linking.openURL(item.memoryVideoUrl);
          } else {
            this.props.navigation.navigate("TripDetails", {
              id: item.id,
            });
          }
        }}
      >
        <View style={styles.container}>
          <ImageBackground
            source={{ uri: item.coverImages[0] }}
            style={styles.image}
          >
            <View
              style={{
                alignItems: "center",
                alignSelf: "flex-start",
                marginTop: "auto",
                display: "flex",
              }}
            >
              <Text style={styles.text}>
                {trimContent(item.location, 13).toUpperCase()}
              </Text>
              <Text style={styles.subText}>
                From: {loadDate(item.startTime).split(",")[0]}
              </Text>
              <Text style={styles.subText}>
                {this.calculateDaysNights(item)}
              </Text>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.scrollContainer}>
        {this.props.trips.length > 0 ? (
          <FlatList
            data={this.props.trips}
            keyExtractor={(item) => item.id}
            renderItem={(item) => renderRow(item)}
            nestedScrollEnabled={true}
          />
        ) : (
          <Text
            h4
            style={{
              height: "100%",
              marginTop: "20%",
              alignSelf: "center",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              color: Colors.greyishText,
            }}
          >
            No Upcoming Trips 😟
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    // alignItems: "center",
    borderRadius: 8,
    borderColor: "grey",
    borderWidth: 0.2,
    margin: 10,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 7,
  },
  image: {
    height: 200,
    borderRadius: 16,
  },
  text: {
    fontSize: 36,
    color: Colors.white,
    // marginTop: "auto",
    alignSelf: "flex-start",
    // width: "10%",
    paddingLeft: "10%",
    paddingRight: "5%",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    marginBottom: "2%",
    fontWeight: "bold",
  },
  subText: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: Colors.white,
    // marginTop: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingBottom: "1%",
    marginRight: "20%",

    //marginTop: "4%",
    marginBottom: "1%",
    paddingLeft: "10%",
    paddingRight: "5%",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default TripsList;
