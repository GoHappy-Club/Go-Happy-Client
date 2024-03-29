import React, { Component } from "react";
import {
  FlatList,
  Linking,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { Badge, Button, Text } from "react-native-elements";
import AwesomeAlert from "react-native-awesome-alerts";

import { Avatar, Card as Cd, Title } from "react-native-paper";
import { Dimensions } from "react-native";
import CalendarDays from "react-native-calendar-slider-carousel";
import { MaterialIndicator } from "react-native-indicators";

import { connect } from "react-redux";
import { setProfile } from "../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import { setSessionAttended } from "../services/events/EventService";
import { razorPay, PaymentConstants, PaymentError } from "./RazorPay/Payments";
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
      alreadyBookedSameDayEvent: false,
      profileImage:
        "https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg",
    };
    //

    this._retrieveData();
  }

  async razorPayWrapper(item) {
    const prefill = {
      email: this.props.profile.email
        ? this.props.profile.email
        : PaymentConstants.emailId,
      contact: this.props.profile.phoneNumber,
      name: this.props.profile.name,
    };
    const _callback = (data) => {
      this.setState({ success: true });

      var _this = this;
      if (data.razorpay_payment_id === "") {
        _this.props.navigation.navigate("GoHappy Club");
      } else {
        this.updateEventBook(item);
        this.setState({ showPaymentAlert: true });
      }
    };
    const _errorHandler = (error) => {
      this.setState({
        paymentAlertMessage: PaymentError.message,
        paymentAlertTitle: "Oops!",
      });
      this.setState({ showPaymentAlert: true });
    };
    razorPay(
      item,
      item.cost,
      prefill,
      "Workshop Payment",
      _callback,
      _errorHandler
    );
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
    var select = new Date(Date.parse(date)).toDateString();
    var tempDate = new Date(Date.parse(date)).setHours(0, 0, 0, 0);
    this.setState({
      selectedDate: select,
    });
    this.setState({ selectedDateRaw: tempDate });
    this.setState({ events: [] });

    this.props.loadEvents(new Date(Date.parse(date)).setHours(0, 0, 0, 0));
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
  updateEventBook(item) {
    this.setState({ bookingLoader: true });
    if (this.getTitle(item) == "Join") {
      setSessionAttended(this.props.profile.phoneNumber);
      Linking.openURL(item.meetingLink);
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.events !== prevState.events) {
      return { events: nextProps.events };
    } else {
      return null;
    }
  }
  loadCaller() {
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
          color: "#2f2f31",
        }}
      >
        {/* No Sessions Available 😟 */}
        Check tomorrow's sessions 😁
      </Text>
    );
  }
  loadDate(item) {
    var dt = new Date(parseInt(item.startTime));
    var hours = dt.getHours(); // gives the value in 24 hours format
    var AmOrPm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    var minutes = dt.getMinutes();
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    var finalTime = hours + ":" + minutes + " " + AmOrPm;
    return finalTime;
  }
  getTitle(item) {
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
          backgroundColor: "#29BFC2",
        }}
      >
        <TouchableOpacity
          style={{ ...styles.card, marginTop: 10, backgroundColor: "#29BFC2" }}
          underlayColor={"#29BFC2"}
          onPress={() =>
            this.props.navigation.navigate("Session Details", {
              event: item,
              phoneNumber: profile.phoneNumber,
              profile: profile,
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
                  textStyle={{ color: "#2f2f31" }}
                />
                <Text style={{ color: "white", fontSize: 14, paddingLeft: 4 }}>
                  {this.loadDate(item)} |
                </Text>
                <Text style={{ color: "white", fontSize: 14, paddingLeft: 4 }}>
                  {item.seatsLeft} seats left
                </Text>
                {item.costType == "paid" && (
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      paddingLeft: 4,
                      position: "absolute",
                      right: 0,
                    }}
                  >
                    {"\u20B9"}
                    {item.cost}
                  </Text>
                )}
              </View>
              {/* <FontAwesomeIcon style={styles.fav} icon={ test } color={ 'black' } size={20} />      */}
            </View>
            <Title style={{ color: "white", fontSize: 20, padding: 4 }}>
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
                  style={{ color: "white", fontSize: 13, paddingLeft: 10 }}
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
                    ? this.razorPayWrapper.bind(this, item)
                    : this.updateEventBook.bind(this, item)
                }
                loading={item.loadingButton}
                loadingProps={{ size: "small", color: "black" }}
                buttonStyle={{ backgroundColor: "white" }}
                titleStyle={{ color: "#2f2f31" }}
              />
            </View>
          </Cd.Content>
        </TouchableOpacity>
      </Cd>
    );
    return (
      <View style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
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
            color: "#2f2f31",
          }}
        >
          {this.state.selectedDate}
        </Text>
        {this.props.childLoader == true && (
          <MaterialIndicator color="#29BFC2" />
        )}
        {this.props.childLoader == false &&
          this.props.events.filter((item) => item.endTime > Date.now()).length >
            0 && (
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
        {this.props.events.filter((item) => item.endTime > Date.now()).length ==
          0 &&
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
            confirmButtonColor="#DD6B55"
            onConfirmPressed={() => {
              this.setState({ showAlert: false });
            }}
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
            confirmButtonColor="#DD6B55"
            onConfirmPressed={() => {
              this.setState({
                showPaymentAlert: false,
                paymentAlertMessage: "Your Payment is Successful!",
                paymentAlertTitle: "Success",
              });
            }}
          />
        )}
      </View>
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
    backgroundColor: "white",
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    paddingBottom: 50,
    margin: 40,
  },
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#29BFC2",
  },
  badge: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    color: "#29BFC2",
    // padding:4
  },
  fav: {
    alignSelf: "flex-start",
  },
  bookButton: {
    backgroundColor: "green",
  },
});

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeDashboard);
