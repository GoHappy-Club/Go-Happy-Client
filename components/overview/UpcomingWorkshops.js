import { Skeleton } from "@rneui/themed";
import { format, fromUnixTime } from "date-fns";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Colors } from "../../assets/colors/color.js";
import { setProfile } from "../../redux/actions/counts.js";

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
  renderRow = ({ item }) => (
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
    const { t } = this.props;
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
                <Text style={styles.headingText}>
                  {t("upcoming_workshops")}
                </Text>
                <View style={styles.line} />
              </View>
              <FlatList
                horizontal={true}
                data={this.props.upcomingWorkshops}
                keyExtractor={(index) => index.toString()}
                renderItem={this.renderRow.bind(this)}
                // nestedScrollEnabled={true}
              />
            </View>
          )}
      </>
    );
  }
}

UpcomingWorkshops.propTypes = {
  upcomingWorkshops: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  reloadOverview: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

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
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(UpcomingWorkshops));
