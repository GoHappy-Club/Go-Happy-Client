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
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
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
];
class TrendingSessions extends Component {
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

  checkIsParticipantInSameEvent(item) {
    let isParticipantInSameEvent = false;
    if (item.sameDayEventId === null) {
      return false;
    }
    this.props.trendingSessions.map((trend) => {
      var session = trend.value;
      if (!isParticipantInSameEvent) {
        isParticipantInSameEvent =
          session.sameDayEventId == item.sameDayEventId &&
          session.participantList.includes(this.props.profile.phoneNumber);
      }
    });
    return isParticipantInSameEvent;
  }

  // Render each row of items
  renderRow = ({ item, index }) => (
    <TouchableOpacity
      onPress={() =>
        this.props.navigation.navigate("Session Details", {
          event: item.value,
          phoneNumber: this.props.profile.phoneNumber,
          profile: this.props.profile,
          onGoBack: () => {
            this.props.reloadOverview();
          },
          alreadyBookedSameDayEvent: this.checkIsParticipantInSameEvent(
            item.value
          ),
        })
      }
    >
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
    </TouchableOpacity>
  );
  render() {
    return (
      <>
        {this.props.trendingSessions == null && (
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
        {this.props.trendingSessions && this.props.trendingSessions.length > 0 && (
          <View style={styles.mainContainer}>
            <View style={styles.headingContainer}>
              <View style={styles.line} />
              <Text style={styles.headingText}>Trending Sessions</Text>
              <View style={styles.line} />
            </View>
            <View style={styles.scrollContainer}>
              <FlatList
                horizontal={true}
                data={this.props.trendingSessions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderRow.bind(this)}
                nestedScrollEnabled={true}
              />
            </View>
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
  container: {
    flexDirection: "row",
    // alignItems: "center",
    borderRadius: 8,
    borderColor: "grey",
    borderWidth: 0.2,
    margin: 10,
  },
  subContainer: {
    flexDirection: "column",
    marginTop: "2%",
    // alignItems: "center",
  },
  headingText: {
    marginHorizontal: 10,
    fontWeight: "bold",
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 8,

    borderTopRightRadius: 0,

    borderBottomRightRadius: 0,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical: 10,
    margin: "5%",

    marginBottom: "2%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "grey",
  },
  text: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  subText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
});

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(TrendingSessions);
