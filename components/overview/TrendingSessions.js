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

class TrendingSessions extends Component {
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
  renderRow = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        this.props.navigation.navigate("Session Details", {
          event: item.value,
          deepId: item.value.id,
          phoneNumber: this.props.profile.phoneNumber,
          profile: this.props.profile,
          onGoBack: () => {
            this.props.navigation.navigate("GoHappy Club");
            this.props.reloadOverview();
          },
          alreadyBookedSameDayEvent: this.checkIsParticipantInSameEvent(
            item.value,
          ),
        })
      }
    >
      <View style={styles.container}>
        <FastImage
          source={{ uri: item.value.coverImage }}
          style={styles.image}
        />
        <View style={styles.subContainer}>
          <Text style={styles.text}>
            {this.trimContent(item.value.eventName, 13)}
          </Text>
          <Text style={styles.subText}>
            {this.loadDate(item.value.startTime)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  render() {
    const { t } = this.props;
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
        {this.props.trendingSessions &&
          this.props.trendingSessions.length > 0 && (
            <View style={styles.mainContainer}>
              <View style={styles.headingContainer}>
                <View style={styles.line} />
                <Text style={styles.headingText}>{t("trending_sessions")}</Text>
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

TrendingSessions.propTypes = {
  trendingSessions: PropTypes.array.isRequired,
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
  container: {
    flexDirection: "row",
    // alignItems: "center",
    borderRadius: 8,
    borderColor: Colors.grey.grey,
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
    backgroundColor: Colors.grey.grey,
  },
  text: {
    marginHorizontal: 10,
    fontSize: 16,
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
)(withTranslation()(TrendingSessions));
