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
import { loadDate, trimContent } from "../commonComponents/helpers";

class TripsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderRow = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        console.log(this.props);
        this.props.navigation.navigate("TripDetailsScreen", { item: item });
      }}
    >
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
    return (
      <View style={styles.scrollContainer}>
        {this.props.trips.length > 0 ? (
          <FlatList
            data={this.props.trips}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderRow.bind(this)}
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
              color: "#2f2f31",
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
    color: "white",
    marginTop: "auto",
    marginLeft: "8%",
    width: "auto",
    paddingLeft: "3%",
    borderTopLeftRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    // marginBottom: "4%",
  },
  subText: {
    fontSize: 18,
    color: "white",
    // marginTop: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingBottom: "1%",
    paddingLeft: "3%",
    marginLeft: "8%",
    marginBottom: "4%",
    borderBottomLeftRadius: 16,
  },
});

export default TripsList;
