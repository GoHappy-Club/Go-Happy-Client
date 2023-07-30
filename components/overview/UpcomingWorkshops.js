import React, { Component } from "react";
import { Card, Divider } from "react-native-paper";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { Skeleton } from "@rneui/themed";

const data = [
  {
    title: "Tambola",
    eventDate: "1687725145435",
    imgUrl:
      "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG98ZW58MHx8MHx8fDA%3D&w=1000&q=80",
  },
  {
    title: "In turpis",
    eventDate: "1687725145435",
    imgUrl:
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
  },
  {
    title: "Lorem Ipsum",
    eventDate: "1687725145435",
    imgUrl:
      "https://images.pexels.com/photos/3314294/pexels-photo-3314294.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  },
  {
    title: "Tambola",
    eventDate: "1687725145435",
    imgUrl:
      "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG98ZW58MHx8MHx8fDA%3D&w=1000&q=80",
  },
  {
    title: "In turpis",
    eventDate: "1687725145435",
    imgUrl:
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
  },
  {
    title: "Lorem Ipsum",
    eventDate: "1687725145435",
    imgUrl:
      "https://images.pexels.com/photos/3314294/pexels-photo-3314294.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  },
];
export default class UpcomingWorkshops extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transformedData: [],
      dataIndex: 0,
    };
  }

  loadDate(time) {
    var dt = new Date(parseInt(time));
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var month = months[dt.getMonth()];
    var day = dt.getDate();
    var hours = dt.getHours();
    var minutes = dt.getMinutes();
    var AmOrPm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    var finalTime =
      month + " " + day + ", " + hours + ":" + minutes + " " + AmOrPm;

    return finalTime;
  }
  trimContent(text, cut) {
    if (text.length < cut) {
      return text;
    }
    return text.substring(0, cut) + "...";
  }

  // Render each row of items
  renderRow = ({ item, index }) => (
    <View style={styles.container}>
      <Image source={{ uri: item.value.coverImage }} style={styles.image} />
      <View style={styles.subContainer}>
        <Text style={styles.text}>
          {this.trimContent(item.value.eventName, 13)}
        </Text>
        <Text style={styles.subText}>
          {this.loadDate(item.value.eventDate)}
        </Text>
      </View>
    </View>
  );
  render() {
    return (
      <>
        {this.props.upcomingWorkshops == null && (
          <View style={{ marginTop: "3%" }}>
            <View style={styles.scrollContainer}>
              <View style={styles.container}>
                <Skeleton
                  animation="pulse"
                  height={100}
                  style={{ borderRadius: 8 }}
                />
              </View>
            </View>
          </View>
        )}
        {this.props.upcomingWorkshops &&
          this.props.upcomingWorkshops.length > 0 && (
            <View style={styles.mainContainer}>
              <View style={styles.headingContainer}>
                <View style={styles.line} />
                <Text style={styles.headingText}>Upcoming Workshops</Text>
                <View style={styles.line} />
              </View>
              <FlatList
                horizontal={true}
                data={this.props.upcomingWorkshops}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderRow.bind(this)}
                // nestedScrollEnabled={true}
              />
            </View>
          )}
      </>
    );
  }
}

const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 0,
  },
  scrollContainer: {},

  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical: 10,
    margin: "5%",

    marginBottom: "2%",
  },
  headingText: {
    marginHorizontal: 10,
    fontWeight: "bold",
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "grey",
  },

  container: {
    // flexDirection: "row",
    // alignItems: "center",
    borderRadius: 8,
    borderColor: "grey",
    borderWidth: 0.2,
    margin: 10,
    width: 100,
  },
  subContainer: {
    padding: "2%",
    // alignItems: "center",
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  text: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  subText: {
    marginHorizontal: 10,
    fontSize: 12,
  },
});
