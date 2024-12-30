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
import { Skeleton } from "@rneui/themed";
import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import { format, fromUnixTime } from "date-fns";
import { Colors } from "../../assets/colors/color.js";
import { useTranslation, withTranslation } from "react-i18next";

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
class UpcomingWorkshops extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transformedData: [],
      dataIndex: 0,
    };
  }

  loadDate(time) {
    const dt = fromUnixTime(time / 1000);
    const finalTime = format(dt, "MMM d, h:mm aa");
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
    <TouchableOpacity
      onPress={() =>
        this.props.navigation.navigate("Session Details", {
          event: item,
          deepId: item.id,
          phoneNumber: this.props.profile.phoneNumber,
          profile: this.props.profile,
          onGoBack: () => {
            this.props.navigation.navigate("GoHappy Club");
            this.props.reloadOverview();
          },
          alreadyBookedSameDayEvent: false,
        })
      }
    >
      <View style={styles.container}>
        <FastImage source={{ uri: item.coverImage }} style={styles.image} />
        <View style={styles.subContainer}>
          <Text style={styles.text}>
            {this.trimContent(item.eventName, 20)}
          </Text>
          <Text style={styles.subText}>{this.loadDate(item.startTime)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  render() {
    const {t} = this.props;
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
                <Text style={styles.headingText}>{t("upcoming_workshops")}</Text>
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
    color: Colors.primaryText,
    marginHorizontal: 10,
    fontWeight: "bold",
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.grey.grey,
  },

  container: {
    // flexDirection: "row",
    // alignItems: "center",
    borderRadius: 8,
    borderColor: Colors.grey.grey,
    borderWidth: 0.2,
    margin: 10,
    width: 200,
  },
  subContainer: {
    padding: "2%",
    // alignItems: "center",
  },

  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  text: {
    marginHorizontal: 10,
    fontSize: 16,
    // fontWeight: "bold",
  },
  subText: {
    marginHorizontal: 10,
    fontSize: 12,
  },
});
const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(UpcomingWorkshops));
