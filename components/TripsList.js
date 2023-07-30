import React, { Component } from "react";
import { Card, Divider } from "react-native-paper";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
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
    return (
      <View style={styles.scrollContainer}>
        <FlatList
          data={this.props.trips}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderRow.bind(this)}
          nestedScrollEnabled={true}
        />
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
