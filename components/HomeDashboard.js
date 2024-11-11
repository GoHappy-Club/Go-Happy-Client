import React, { Component } from "react";
import {
  FlatList,
  Linking,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Share,
  Image,
} from "react-native";
import { Badge, Button, Text } from "react-native-elements";
import AwesomeAlert from "react-native-awesome-alerts";
import { parseISO, format, getTime, fromUnixTime } from "date-fns";
import { Avatar, Card as Cd, Title } from "react-native-paper";
import { Dimensions } from "react-native";
import CalendarDays from "react-native-calendar-slider-carousel";
import { MaterialIndicator } from "react-native-indicators";

import { connect } from "react-redux";
import { setMembership, setProfile } from "../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import { setSessionAttended } from "../services/events/EventService";

import toUnicodeVariant from "./toUnicodeVariant.js";
import GOHLoader from "../commonComponents/GOHLoader.js";
import tambola from "tambola";
import { Colors } from "../assets/colors/color.js";
import SearchBar from "./SearchBar.js";
import { wp } from "../helpers/common.js";
import { storeCompletedSession } from "../services/Startup.js";
const { width: screenWidth } = Dimensions.get("window");

class HomeDashboard extends Component {
  constructor(props) {
    super(props);
    var today = new Date().toDateString();
    var todayRaw = new Date().setHours(0, 0, 0, 0);
    this.state = {
      loader: false,
      selectedDate: today,
      email: null,
      bookingLoader: false,
      selectedDateRaw: todayRaw,
      showAlert: false,
      paymentAlertMessage: "Your Payment is Successful!",
      paymentAlertTitle: "Success",
      showPaymentAlert: false,
      shareLink: "",
      clickPopup: false,
      alreadyBookedSameDayEvent: false,
      itemToBuy: null,
      profileImage:
        "https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg",
      belowAgePopUp: false,
      itemClicked: null,
      payButtonLoading: false,
      shareButtonLoading: false,
      nonMemberPopUp: false,
      lowCoinsPopUp: false,
    };
    this._retrieveData();
  }

  handleClickBook(item) {
    if (!this.isBookingAllowed(item)) return;
    // this.setState({ itemToBuy: item }, () => {
    //   this.setState({ clickPopup: true });
    // });
    this.updateEventBook(item);
  }

  isBookingAllowed(item) {
    if (this.props.membership.freeTrialActive == "true") return true;
    if (
      this.props.membership &&
      this.props.membership?.membershipType == "Free"
    ) {
      // this.setState({ nonMemberPopUp: true });
      this.props.navigation.navigate("SubscriptionPlans");
      return false;
    } else if (
      this.props.membership &&
      this.props.membership?.coins < item.cost
    ) {
      this.setState({ lowCoinsPopUp: true });
      return false;
    }

    return true;
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("email");
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      if (value !== null) {
        // We have data!!
        this.setState({ email: value });
        //
      }
      if (phoneNumber !== null) {
        // We have data!!
        this.setState({ phoneNumber: phoneNumber });
        //
      }
    } catch (error) {
      // Error retrieving data
      //
    }
  };

  changeSelectedDate = (date) => {
    const parsedSelect = parseISO(date);
    const select = format(parsedSelect, "EEE MMM dd yyyy");
    const tempDate = getTime(date);

    this.setState({
      selectedDate: select,
    });
    this.setState({ selectedDateRaw: tempDate });
    this.setState({ events: [] });

    this.props.loadEvents(tempDate);
  };
  trimContent(text, cut) {
    if (text.length < cut) {
      return text;
    }
    return text.substring(0, cut) + "...";
  }
  isOngoingEvent(item) {
    crashlytics().log(
      JSON.stringify(item.startTime) + JSON.stringify(new Date().getTime())
    );
    if (item.startTime - 600000 <= new Date().getTime()) {
      return true;
    }
    return false;
  }
  checkIsParticipantInSameEvent(item) {
    let isParticipantInSameEvent = false;
    if (item.sameDayEventId === null) {
      return false;
    }
    this.props.events.map((event) => {
      if (!isParticipantInSameEvent) {
        isParticipantInSameEvent =
          event.sameDayEventId == item.sameDayEventId &&
          event.participantList.includes(this.props.profile.phoneNumber);
      }
    });
    return isParticipantInSameEvent;
  }
  handleBelowAge(item, url) {
    const link = url;
    const shareMessage =
      "👋 Hi! A new session is starting at GoHappy Club, which is very useful and interesting for seniors. \n\n" +
      "📚 The name of the session is *" +
      toUnicodeVariant(item.eventName, "bold italic") +
      "*.\n\n" +
      "I think you will definitely like it! 😊 \n\n" +
      "👉 Here is the link to the session: \n" +
      link +
      ".\n\n" +
      "💬 Join in and let me know how you liked it! 👍";

    Share.share({
      message: shareMessage,
    })
      .then((result) => {})
      .catch((errorMsg) => {});
  }

  async updateEventBook(item) {
    //console.log("item clicked is", item)
    this.setState({ bookingLoader: true, itemClicked: item });
    if (this.getTitle(item) == "Share") {
      this.setState({ belowAgePopUp: true });
      return;
    }
    if (this.getTitle(item) == "Join") {
      await storeCompletedSession(item.id, item.eventName, item.coverImage);
      setSessionAttended(this.props.profile.phoneNumber);
      await Linking.openURL(item.meetingLink);
      await this.giveRewards(item);
      return;
    }
    if (this.checkIsParticipantInSameEvent(item)) {
      this.setState({ showAlert: true });
      return;
    }
    item.loadingButton = true;
    this.props.bookEvent(
      item,
      this.props.profile.phoneNumber,
      this.state.selectedDateRaw
    );
  }

  async giveRewards(item) {
    let { membership, actions } = this.props;

    try {
      const response = await axios.post(`${SERVER_URL}/event/giveReward`, {
        phone: this.props.profile.phoneNumber,
        eventId: item.id,
      });
      membership.coins = response.data.coins;
      actions.setMembership({ ...membership });
    } catch (error) {
      console.log("Error in giveRewards ==>", error);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.events !== prevState.events) {
      return { events: nextProps.events };
    } else {
      return null;
    }
  }
  loadCaller() {
    this.props.navigation.navigate("HomeScreen");
    this.props.loadEvents(this.state.selectedDateRaw);
  }

  sorry() {
    return (
      <Text
        h4
        style={{
          height: "100%",
          marginTop: "20%",
          alignSelf: "center",
          textAlign: "center",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          color: Colors.greyishText,
        }}
      >
        {/* No Sessions Available 😟 */}
        Check tomorrow's sessions 😁
      </Text>
    );
  }
  loadDate(item) {
    const dt = fromUnixTime(item.startTime / 1000);
    const finalTime = format(dt, "MMM d, h:mm aa");
    return finalTime;
  }
  getTitle(item) {
    if (this.props.profile.age != null && this.props.profile.age < 50) {
      return "Share";
    }
    const isOngoing = this.isOngoingEvent(item);
    if (item.participantList == null) {
      return "Book";
    }
    const isParticipant = item.participantList.includes(
      this.props.profile.phoneNumber
    );

    // crashlytics().log("this is item", isOngoing, isParticipant);
    if (isOngoing && isParticipant) {
      return "Join";
    } else if (isParticipant) {
      return "Booked";
    } else if (item.seatsLeft == 0) {
      return "Seats Full";
    } else {
      return "Book";
    }
  }
  isDisabled(item) {
    const isOngoing = this.isOngoingEvent(item);
    if (item.participantList == null) {
      return false;
    }

    const isParticipant = item.participantList.includes(
      this.props.profile.phoneNumber
    );

    if (isParticipant && !isOngoing) {
      return true;
    } else if (isParticipant) {
      return false;
    } else if (item.seatsLeft == 0) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { profile } = this.props;
    const renderItem = ({ item }) => (
      <Cd
        style={{
          ...styles.card,
          marginLeft: 30,
          marginRight: 30,
          marginBottom: 15,
          backgroundColor: Colors.primary,
        }}
      >
        <TouchableOpacity
          style={{
            ...styles.card,
            marginTop: 10,
            backgroundColor: Colors.primary,
          }}
          underlayColor={Colors.primary}
          onPress={() =>
            this.props.navigation.navigate("Session Details", {
              phoneNumber: profile.phoneNumber,
              profile: profile,
              deepId: item.id,
              onGoBack: () => this.loadCaller(),
              alreadyBookedSameDayEvent:
                this.checkIsParticipantInSameEvent(item),
            })
          }
        >
          <Cd.Content>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 4,
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Badge
                  value={item.costType == "paid" ? "Workshop" : item.category}
                  badgeStyle={styles.badge}
                  textStyle={{ color: Colors.greyishText }}
                />
                <Text
                  style={{ color: Colors.white, fontSize: 14, paddingLeft: 4 }}
                >
                  {this.loadDate(item)} |
                </Text>
                <Text
                  style={{ color: Colors.white, fontSize: 14, paddingLeft: 4 }}
                >
                  {item.seatsLeft} seats left
                </Text>
                {item.costType == "paid" && (
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 14,
                      paddingLeft: 4,
                      position: "absolute",
                      right: 0,
                    }}
                  >
                    {item.cost}{" "}
                    <Image
                      source={require("../images/GoCoins.png")}
                      style={{
                        height: 15,
                        width: 15,
                      }}
                    />
                  </Text>
                )}
              </View>
            </View>
            <Title style={{ color: Colors.white, fontSize: 20, padding: 4 }}>
              {this.trimContent(item.eventName, 30)}
            </Title>

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
                    item.expertImage
                      ? {
                          uri: item.expertImage,
                        }
                      : require("../images/profile_image.jpeg")
                  }
                  size={30}
                />
                <Title
                  style={{ color: Colors.white, fontSize: 13, paddingLeft: 10 }}
                >
                  {this.trimContent(item.expertName, 17)}
                </Title>
              </View>
              {/* item.participantList!=null && item.participantList.includes(this.state.email) */}
              {/* <Text>
                {item.startTime <= new Date().getTime()
                  ? "rererer"
                  : "fewrewfsdfsd"}
              </Text> */}
              <Button
                disabled={this.isDisabled(item)}
                title={this.getTitle(item)}
                onPress={
                  item.costType == "paid" && this.getTitle(item) == "Book"
                    ? this.handleClickBook.bind(this, item)
                    : this.updateEventBook.bind(this, item)
                }
                loading={item.loadingButton}
                loadingProps={{ size: "small", color: Colors.black }}
                buttonStyle={{ backgroundColor: Colors.white }}
                titleStyle={{ color: Colors.greyishText }}
              />
            </View>
          </Cd.Content>
        </TouchableOpacity>
      </Cd>
    );
    return (
      <>
        <View>
          <SearchBar
            loadCaller={this.loadCaller}
            checkIsParticipantInSameEvent={this.checkIsParticipantInSameEvent}
          />
        </View>
        <View style={{ flex: 1, backgroundColor: Colors.grey.f0 }}>
          <CalendarDays
            numberOfDays={15}
            daysInView={3}
            paginate={true}
            onDateSelect={(date) => this.changeSelectedDate(date)}
          />
          <Text
            h4
            style={{
              marginLeft: 30,
              marginTop: 20,
              marginBottom: 15,
              color: Colors.greyishText,
            }}
          >
            {this.state.selectedDate}
          </Text>
          {this.props.childLoader == true && (
            // <MaterialIndicator color={Colors.primary} />
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.grey.f0,
              }}
            >
              <GOHLoader />
            </View>
          )}
          {this.props.childLoader == false &&
            this.props.events.filter((item) => item.endTime > Date.now())
              .length > 0 && (
              <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                  contentContainerStyle={{ flexGrow: 1 }}
                  data={this.props.events.filter(
                    (item) => item.endTime > Date.now()
                  )}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                />
              </SafeAreaView>
            )}
          {this.props.events.filter((item) => item.endTime > Date.now())
            .length == 0 &&
            this.props.childLoader == false &&
            this.sorry()}
          {/* {wentBack ? 'do something it went back!' : 'it didnt go back'} */}
          {this.state.showAlert && (
            <AwesomeAlert
              show={this.state.showAlert}
              showProgress={false}
              title="Oops!"
              message="You have already booked the same session for this date. Please cancel your booking of the other session and try again."
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showConfirmButton={true}
              confirmText="Try Again"
              confirmButtonColor={Colors.errorButton}
              onConfirmPressed={() => {
                this.setState({ showAlert: false });
              }}
              onDismiss={() => this.setState({ showAlert: false })}
            />
          )}
          {this.state.showPaymentAlert && (
            <AwesomeAlert
              show={this.state.showPaymentAlert}
              showProgress={false}
              title={this.state.paymentAlertTitle}
              message={this.state.paymentAlertMessage}
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showConfirmButton={true}
              confirmText="OK"
              confirmButtonColor={Colors.errorButton}
              onConfirmPressed={() => {
                this.setState({
                  showPaymentAlert: false,
                  paymentAlertMessage: "Your Payment is Successful!",
                  paymentAlertTitle: "Success",
                });
              }}
              onDismiss={() => this.setState({ showPaymentAlert: false })}
            />
          )}
          {this.state.belowAgePopUp && (
            <AwesomeAlert
              show={this.state.belowAgePopUp}
              showProgress={false}
              // title={""}
              message={
                "GoHappy Club is an initiative exclusively for aged 50 years and above. You can not join this session but share it with your family members."
              }
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showConfirmButton={true}
              confirmText="Share"
              confirmButtonColor={Colors.primary}
              onConfirmPressed={() => {
                this.handleBelowAge(
                  this.state.itemClicked,
                  "https://www.gohappyclub.in/session_details/" +
                    this.state.itemClicked.id
                );
                this.setState({ belowAgePopUp: false });
              }}
              onDismiss={() => this.setState({ belowAgePopUp: false })}
            />
          )}
          {this.state.nonMemberPopUp && (
            <AwesomeAlert
              show={this.state.nonMemberPopUp}
              showProgress={false}
              title={"Booking Failed"}
              message={
                "You are not a member of GoHappy Club, Join us by clicking below button."
              }
              messageStyle={{
                textAlign: "center",
                fontFamily: "Poppins-Regular",
              }}
              titleStyle={{
                fontSize: wp(5),
                fontFamily: "NunitoSans-SemiBold",
                color: Colors.red,
              }}
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={true}
              showConfirmButton={true}
              showCancelButton={false}
              confirmText="Join Now"
              confirmButtonColor={Colors.primary}
              onConfirmPressed={() => {
                this.props.navigation.navigate("SubscriptionPlans");
              }}
              onDismiss={() => this.setState({ nonMemberPopUp: false })}
            />
          )}
          {this.state.lowCoinsPopUp && (
            <AwesomeAlert
              show={this.state.lowCoinsPopUp}
              showProgress={false}
              title={"Booking Failed"}
              message={
                "You don't have enough coins, Please top-up coins to book this session."
              }
              messageStyle={{
                textAlign: "center",
                fontFamily: "Poppins-Regular",
                color: Colors.black,
              }}
              titleStyle={{
                fontSize: wp(5),
                fontFamily: "NunitoSans-SemiBold",
                color: Colors.red,
              }}
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={true}
              showConfirmButton={true}
              showCancelButton={false}
              confirmText="Top up Now"
              confirmButtonColor={Colors.primary}
              onConfirmPressed={() => {
                this.props.navigation.navigate("TopUpScreen");
              }}
              onDismiss={() => this.setState({ lowCoinsPopUp: false })}
            />
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.grey.lightgrey,
    paddingBottom: 50,
    margin: 40,
  },
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.white,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  badge: {
    backgroundColor: Colors.white,
    alignSelf: "flex-start",
    color: Colors.primary,
    // padding:4
  },
  fav: {
    alignSelf: "flex-start",
  },
  bookButton: {
    backgroundColor: Colors.green,
  },
  AAcontainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  AAtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.grey.grey,
  },
  AAmessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.grey.grey,
  },
  AAbuttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  AAbutton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    minWidth: 100,
  },
  AApayButton: {
    backgroundColor: Colors.primary,
  },
  AAshareButton: {
    backgroundColor: Colors.grey.grey,
  },
  AAbuttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  membership: state.membership.membership,
});

const ActionCreators = Object.assign({}, { setProfile, setMembership });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeDashboard);
