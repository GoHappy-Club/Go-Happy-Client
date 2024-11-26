import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  Button,
  Alert,
  Text,
  Image,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import { BackgroundImage } from "react-native-elements/dist/config";
// import { ScrollView } from "reac t-native-gesture-handler";
import * as Progress from "react-native-progress";
import { Colors } from "../../assets/colors/color";

const screenWidth = Dimensions.get("window").width;
export default class ReferralsList extends React.Component {
  state = {
    referralComplete: 7,
    refreshing: false,
  };
  _onRefresh() {
    this.setState({ refreshing: true });
    var _this = this;
    this.props.requestReferrals(function () {
      _this.setState({ refreshing: false });
    });
  }
  render() {
    const barHeight = 29;
    const barWidth = Dimensions.get("screen").width * 0.5;
    const openedChestCount = Math.floor(this.props.numberReferrals / 7);
    const currentCount = this.props.numberReferrals - openedChestCount * 7;
    var chestType =
      currentCount < this.state.referralComplete
        ? require("../../images/chest-closed.png")
        : require("../../images/chest-opened.png");
    var chest = (
      <Image
        // resizeMode="cover"
        style={styles.chest}
        source={chestType}
      />
    );
    var chestOpened = (
      <Image
        // resizeMode="cover"
        style={styles.chest}
        source={require("../../images/chest-opened.png")}
      />
    );

    // for creating repetitive chests
    const chestComponents = [];
    for (let i = 0; i < openedChestCount; i++) {
      chestComponents.push(
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <Progress.Bar
            style={styles.progressBar}
            //animated={false}
            color={Colors.primary}
            borderColor={Colors.primary}
            progress={1.0}
            width={barWidth}
            height={barHeight}
          />
          {chestOpened}
          <Text style={styles.label1}>7/7</Text>
        </View>
      );
    }

    const ReferredProfileItem = ({ item }) => (
      <>
        <View style={styles.divider}></View>
        <View style={styles.referralsItem}>
          <Image
            style={styles.profilePic}
            source={{
              uri: item.toProfileImage,
            }}
          />
          <View style={styles.referralsText}>
            <Text style={styles.referralsContents}>
              {item.toName.trim() ? item.toName.trim() : item.to}
            </Text>
            <Text style={styles.referralsTime}>{item.time}</Text>
          </View>
          {item.hasAttendedSession && (
            <Image
              style={{
                height: 30,
                width: 30,
                alignSelf: "center",
                marginLeft: "auto",
              }}
              source={require("../../images/tick-icon.png")}
            ></Image>
          )}
          {!item.hasAttendedSession && (
            <Image
              style={{
                height: 30,
                width: 30,
                alignSelf: "center",
                marginLeft: "auto",
              }}
              source={require("../../images/hourglass.png")}
            ></Image>
          )}
        </View>
      </>
    );

    return (
      <SafeAreaView>
        <View style={styles.questContainer}>
          <Text style={styles.label}>Referral Level</Text>
          {openedChestCount <= 1 && (
            <Text
              style={{
                fontSize: 15,
                marginLeft: 20,
                marginBottom: 5,
                color: Colors.white,
              }}
            >
              ({openedChestCount} level completed)
            </Text>
          )}
          {openedChestCount > 1 && (
            <Text style={{ fontSize: 15, marginLeft: 20, marginBottom: 5 }}>
              ({openedChestCount} levels completed)
            </Text>
          )}
          {/*chestComponents*/}
          <View style={{ flexDirection: "row" }}>
            <Progress.Bar
              style={styles.progressBar}
              color={Colors.white}
              borderColor={Colors.white}
              // indeterminateAnimationDuration={10000}
              progress={currentCount / 7}
              width={barWidth}
              height={barHeight}
            />
            {chest}
            <Text style={styles.label1}>{currentCount}/7</Text>
          </View>
        </View>
        <View style={{ paddingTop: 10,paddingBottom:30,flex:1 }}>
          <FlatList
            data={this.props.referrals}
            renderItem={({ item }) => <ReferredProfileItem item={item} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  progressBar: {
    borderRadius: 30,
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 10,
  },
  label: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 20,
  },
  label1: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    alignSelf: "center",
  },
  chest: {
    width: 40,
    aspectRatio: 1 / 1,
    marginLeft: "5%",
  },
  divider: {
    borderWidth: 5,
    color: Colors.black,
  },
  profilePic: {
    marginLeft: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: "center",
  },
  referralsList: {
    marginTop: 20,
    marginBottom: 10,
    marginRight: 10,
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "red",
  },
  divider: {
    borderTopWidth: 0.5,
    borderColor: Colors.grey.grey,
  },
  referralsItem: {
    height: 50,
    marginHorizontal: 0,
    display: "flex",
    flexDirection: "row",
    marginTop: "2%",
    marginBottom: "2%",
    // marginLeft: "2%",
    // marginRight: "2%",
    width: "100%",
    // alignSelf: "center",
    // alignContent: "center",
  },
  referralsText: {
    marginLeft: 16,
    // height: 50,
    marginHorizontal: 0,
    // display: "flex",
    // flexDirection: "row",
    // alignSelf: "center",
    // alignContent: "center",
  },
  referralsItemStatus: {
    height: 50,
    marginHorizontal: 0,
    textAlignVertical: "center",
    // alignSelf: "center",
    // alignContent: "center",
  },
  referralsTitle: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "bold",
  },
  referralsContents: {
    fontSize: 15,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  referralsTime: {
    fontSize: 10,
  },
  questContainer: {
    backgroundColor: Colors.primary,
    width: screenWidth * 0.9,
    borderRadius: 20,
    // marginBottom: 20,
  },
  statusListContainer: {
    width: screenWidth * 0.9,
    // flex:1,
    height: "100%",
    borderRadius: 20,
    backgroundColor: "red",
    // borderTopWidth: 0.5,
    // borderColor: Colors.grey.grey,
  },
});
