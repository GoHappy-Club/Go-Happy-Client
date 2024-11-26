import React, { Component } from "react";

import {
  FlatList,
  Linking,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text } from "react-native-elements";
import { WebView } from "react-native-webview";

import { Avatar, Card as Cd, Title } from "react-native-paper";
import { format, fromUnixTime } from "date-fns";
import { Colors } from "../assets/colors/color";
import { connect } from "react-redux";
import { hp, wp } from "../helpers/common";

class MySessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      email: "",
      password: "",
      showAlert: false,
      loader: false,
      mySession: [],
      refreshing: false,
      videoVisible: false,
      videoVisible1: false,
      profileImage:
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/da/Matt_LeBlanc_as_Joey_Tribbiani.jpg/220px-Matt_LeBlanc_as_Joey_Tribbiani.jpg",
    };
    // alert(JSON.stringify(props));
    this._retrieveData();
  }
  _retrieveData = async () => {
    try {
      const email = await AsyncStorage.getItem("email");
      this.setState({ email: email });
    } catch (error) {
      // Error retrieving data
    }
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.mySessions !== prevState.mySessions) {
      return { mySessions: nextProps.mySessions };
    } else {
      return null;
    }
  }
  trimContent(text, cut) {
    if (text.length < cut) {
      return text;
    }
    return text.substring(0, cut) + "...";
  }

  loadDate(item) {
    const dt = fromUnixTime(item / 1000);
    const finalTime = format(dt, "hh:mm a");
    return finalTime;
  }

  sorry() {
    return (
      <>
        <View style={{
          height:hp(100),
          justifyContent:"center",
          alignItems:"center",
        }}>
          <Text
            h3
            style={{
              marginTop: "20%",
              alignSelf: "center",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {this.props.membership &&
            this.props.membership.membershipType == "Free"
              ? "Sorry😟, Recordings are not available for Free users"
              : "No Recordings Found 😟"}
          </Text>
          {this.props.membership &&
            this.props.membership.membershipType == "Free" && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: hp(5),
                }}
              >
                <Pressable
                  style={{
                    backgroundColor: Colors.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}
                  onPress={() => {
                    this.props.navigation.navigate("SubscriptionPlans");
                  }}
                >
                  <Text
                    style={{
                      fontSize: wp(5),
                      color: Colors.white,
                      paddingHorizontal:wp(1),
                      paddingVertical:wp(1.5),
                    }}
                  >
                    Become a member now
                  </Text>
                </Pressable>
              </View>
            )}
        </View>
      </>
    );
  }
  videoPlayer(link) {
    this.setState({ videoVisible1: true, recordingLink: link });
    return;
  }
  startEvent(item) {
    Linking.openURL(item.meetingLink);
  }
  render() {
    const renderItem = ({ item }, type) => (
      <Cd
        style={{
          ...styles.card,
          marginLeft: 10,
          marginRight: 10,
          marginBottom: 10,
          backgroundColor: Colors.white,
        }}
      >
        <TouchableOpacity
          style={{ ...styles.card, marginTop: 10 }}
          underlayColor={Colors.grey.grey}
          onPress={() =>
            this.props.navigation.navigate("Session Details", {
              event: item,
              deepId: item.id,
              type: type,
              phoneNumber: this.props.phoneNumber,
              profile: this.props.profile,
              onGoBack: () => this.loadCaller(),
            })
          }
        >
          <Cd.Content>
            <Text style={{ padding: 4 }}>
              {new Date(parseInt(item.startTime)).toDateString()} |{" "}
              {this.loadDate(item.startTime)}
            </Text>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 4,
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text
                  style={{
                    color: Colors.grey["4"],
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  {this.trimContent(item.eventName, 30)}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 4,
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Avatar.Image
                  source={
                    // {
                    require("../images/profile_image.jpeg")
                    // uri: this.state.profileImage
                    // }
                  }
                  size={30}
                />
                <Title
                  style={{
                    color: Colors.grey["4"],
                    fontSize: 13,
                    paddingLeft: 10,
                  }}
                >
                  {this.trimContent(item.expertName, 17)}
                </Title>
              </View>
              {type == "ongoing" && (
                <Button
                  disabled={
                    item.participantsList != null &&
                    item.participantsList.includes(this.props.phoneNumber)
                      ? true
                      : false
                  }
                  title="Join"
                  buttonStyle={{ backgroundColor: Colors.primary }}
                  onPress={this.startEvent.bind(this, item)}
                  loading={item.loadingButton}
                />
              )}
              {type == "expired" && (
                <Button
                  disabled={
                    item.participantsList != null &&
                    item.participantsList.includes(this.props.phoneNumber)
                      ? true
                      : false
                  }
                  title="View Recording"
                  buttonStyle={{ backgroundColor: Colors.primary }}
                  onPress={this.videoPlayer.bind(this, item.recordingLink)}
                  loading={item.loadingButton}
                />
              )}
            </View>
          </Cd.Content>
        </TouchableOpacity>
      </Cd>
    );

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {this.props.ongoingEvents.length == 0 &&
          this.props.upcomingEvents.length == 0 &&
          this.props.expiredEvents.length == 0 &&
          this.sorry()}
        {this.props.ongoingEvents.length > 0 && (
          <Text h4 style={{ marginLeft: 5, marginTop: 20, marginBottom: 15 }}>
            {this.props.ongoingEvents.length > 0 && (
              <Text
                h4
                style={{ marginLeft: 30, marginTop: 20, marginBottom: 15 }}
              >
                Ongoing Events
              </Text>
            )}
            {this.props.childLoader == true && (
              <MaterialIndicator color={Colors.blue.blue} />
            )}
          </Text>
        )}
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.props.ongoingEvents}
            renderItem={(item) => renderItem(item, "ongoing")}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
        {this.props.upcomingEvents.length > 0 && (
          <Text h4 style={{ marginLeft: 5, marginTop: 20, marginBottom: 15 }}>
            {this.props.upcomingEvents.length > 0 && (
              <Text
                h4
                style={{ marginLeft: 30, marginTop: 20, marginBottom: 15 }}
              >
                Upcoming Events
              </Text>
            )}
            {this.props.childLoader == true && (
              <MaterialIndicator color={Colors.blue.blue} />
            )}
          </Text>
        )}
        <SafeAreaView style={styles.container}>
          <FlatList
            horizontal={true}
            data={this.props.upcomingEvents}
            renderItem={(item) => renderItem(item, "upcoming")}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
        {this.props.expiredEvents.length > 0 && (
          <Text h4 style={{ marginLeft: 5, marginTop: 20, marginBottom: 15 }}>
            {this.props.childLoader == true && (
              <MaterialIndicator color={Colors.blue.blue} />
            )}
          </Text>
        )}
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.props.expiredEvents}
            renderItem={(item) => renderItem(item, "expired")}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
        {this.state.recordingLink && (
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.videoVisible1}
            onRequestClose={() => {
              this.setState({ videoVisible1: false });
            }}
          >
            <WebView
              allowsFullscreenVideo
              javaScriptEnabled={true}
              style={{ flex: 1, borderColor: Colors.red, borderWidth: 1 }}
              source={{
                uri: this.state.recordingLink,
              }}
            />
          </Modal>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  container1: {
    flex: 1,
    backgroundColor: Colors.materialIndicatorColor,
  },
  input: {
    width: "90%",
    backgroundColor: Colors.white,
    padding: 15,
    marginBottom: 10,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  userBtn: {
    backgroundColor: "#f0ad4e",
    paddingVertical: 15,
    height: 60,
  },
  btnTxt: {
    fontSize: 20,
    textAlign: "center",
    color: Colors.black,
    fontWeight: "700",
  },
  registerTxt: {
    marginTop: 5,
    fontSize: 15,
    textAlign: "center",
    color: Colors.white,
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    margin: 10,
    color: Colors.white,
  },
  logo: {
    width: 150,
    height: 150,
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {},
  title: {
    color: Colors.white,
    marginTop: 10,
    width: 160,
    opacity: 0.9,
    textAlign: "center",
  },
  newinput: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 10,
    color: Colors.white,
    paddingHorizontal: 10,
  },
  container2: {
    padding: 25,
  },
  title2: {
    color: Colors.white,
    marginTop: "30%",
    marginBottom: 10,
    opacity: 0.9,
    textAlign: "center",
    fontSize: 30,
  },
});

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  membership: state.membership.membership,
});

export default connect(mapStateToProps)(MySessions);
