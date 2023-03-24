import React, { Component } from "react";
import {
  Image,
  Linking,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";

import { WebView } from "react-native-webview";
import { Avatar, Title } from "react-native-paper";
import { Button, Text } from "react-native-elements";
import TambolaTicket from "./TambolaTicket.js";
import toUnicodeVariant from "./toUnicodeVariant.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { setSessionAttended } from "../services/events/EventService";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import RenderHtml from "react-native-render-html";
import firebase from "@react-native-firebase/app";
import { FirebaseDynamicLinksProps } from "../config/CONSTANTS";
import { strProps } from "../config/CONSTANTS.js";
export default class SessionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadyBookedSameDayEvent: props.alreadyBookedSameDayEvent,
      event: props.event,
      modalVisible: false,
      showAlert: false,
      showPaymentAlert: false,
      paymentAlertMessage: "Your Payment is Successful!",
      paymentAlertTitle: "Success",
      profileImage:
        "https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg",
      loadingButton: false,
      videoVisible: false,
      defaultCoverImage:
        "https://cdn.dnaindia.com/sites/default/files/styles/full/public/2019/09/05/865428-697045-senior-citizens-03.jpg",
    };
  }
  async razorPay(item) {
    var cost = item.cost;
    var orderId = await this.props.getOrderId(cost);
    var options = {
      description: strProps().rp_description,
      currency: "INR",
      key: strProps().razorPayKey,
      amount: cost * 100,
      name: strProps().rp_description,
      readonly: { email: true },

      // plan_id:'plan_JA3o75RQvPfKXP',
      // total_count:6,
      // notes: {
      // 	name: "Subscription A"
      //   },

      order_id: orderId, //Replace this with an order_id created using Orders API.
      prefill: {
        email: strProps().emailId,
        contact: this.props.profile.phoneNumber,
        name: this.props.profile.name,
      },
      theme: { color: "#53a20e" },
    };
    var _this = this;
    // if (this.state.payType == "m") {
    //   Linking.openURL("https://rzp.io/i/qoGMhiRx");
    // } else {
    //   Linking.openURL("https://pages.razorpay.com/ContributeUs");
    // }
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        // if(data.razorpay_payment_id!=''){
        this.setState({ success: true });
        console.log("ffffffffffffffffffff");
        console.log(this.props.profile);
        console.log(data);
        // alert(JSON.stringify(this.state.profile));
        // }
        // alert(`Success: ${data.razorpay_payment_id}`);

        var _this = this;
        if (data.razorpay_payment_id === "") {
          this.props.setPaymentData(
            this.state.profile.phoneNumber,
            this.state.amount,
            function () {
              _this.props.navigation.navigate("GoHappy Club");
            }
          );
        } else {
          this.sessionAction();
          this.setState({ showPaymentAlert: true });
        }

        //if data.status_code is 200, then make below call
      })
      .catch((error) => {
        this.setState({
          paymentAlertMessage:
            "Your payment could not be processed. Please try again later.",
          paymentAlertTitle: "Oops!",
        });
        this.setState({ showPaymentAlert: true });
        // alert(JSON.stringify(error));
        // console.log(error);
        // handle failure

        // ToastAndroid.show(
        //   "Payment could not be processed, please try again.",
        //   ToastAndroid.LONG
        // );
      });
  }
  componentDidMount() {
    this.createDynamicReferralLink();
  }
  createDynamicReferralLink = async () => {
    let selfInviteCode = this.props.profile.selfInviteCode;
    // alert('hi');
    crashlytics().log(JSON.stringify(this.props.profile));
    if (selfInviteCode == null) {
      selfInviteCode = "test";
    }
    const link1 = await firebase.dynamicLinks().buildShortLink(
      {
        link: FirebaseDynamicLinksProps().link + selfInviteCode,
        domainUriPrefix: FirebaseDynamicLinksProps().domainUriPrefix,
        android: {
          packageName: FirebaseDynamicLinksProps().androidPackageName,
          fallbackUrl: FirebaseDynamicLinksProps().androidFallBackUrl,
        },
        ios: {
          bundleId: "com.gohappyclient",
          fallbackUrl:
            "https://play.google.com/store/apps/details?id=com.gohappyclient",
        },
      },
      firebase.dynamicLinks.ShortLinkType.SHORT
    );

    this.setState({ referralLink: link1 });
    // actions.setProfile(profile);
  };
  isDisabled() {
    var title = this.getTitle();
    if (
      title == "Seats Full" ||
      (title == "Cancel Your Booking" && this.state.event.costType == "paid")
    ) {
      return true;
    } else {
      return false;
    }
  }
  getTitle() {
    var currTime = Date.now();
    if (this.props.type == null) {
    }
    if (this.props.type == "expired") {
      return "View Recording";
    }
    if (this.props.type == "ongoing") {
      return "Join";
    }
    if (
      this.state.event.participantList != null &&
      this.props.phoneNumber != null &&
      this.state.event.participantList.includes(this.props.phoneNumber)
    ) {
      if (currTime > this.state.event.endTime) {
        return "View Recording";
      } else if (currTime + 600000 < this.state.event.startTime) {
        return "Cancel Your Booking";
      } else {
        return "Join";
      }
    }
    if (this.state.event.seatsLeft == 0) {
      return "Seats Full";
    }
    return "Book";
  }

  checkTambola() {
    if (this.props.event.eventName.contains("Tambola")) {
      return true;
    }
    return false;
  }
  sessionAction() {
    crashlytics().log(
      JSON.stringify(this.getTitle()) +
        JSON.stringify(this.state.alreadyBookedSameDayEvent)
    );
    if (
      this.getTitle() === "Book" &&
      this.state.alreadyBookedSameDayEvent == true
    ) {
      this.setState({ showAlert: true });
      return;
    }
    if (this.getTitle() === "View Recording") {
      this.videoPlayer();
      return;
    }
    if (this.getTitle() === "Join") {
      setSessionAttended(this.props.phoneNumber);
      Linking.openURL(this.props.event.meetingLink);
      return;
    }

    var output = this.props.sessionAction("book");
    this.setState({ loadingButton: true });
    if (output == "SUCCESS") {
    }
  }
  loadDate(item) {
    var dt = new Date(parseInt(item));
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
    // return (new Date(parseInt(item.startTime))).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
  }
  videoPlayer() {
    this.setState({ videoVisible: true });
  }
  createShareMessage(item) {
    let template =
      'Namaste !! I am attending "😃 ' +
      toUnicodeVariant(item.eventName, "bold italic") +
      ' 😃" session. Aap bhi join kr skte ho mere sath, super entertaining and informative session of ' +
      toUnicodeVariant("GoHappy Club", "bold") +
      ", apni life ke dusre padav ko aur productive and exciting bnane ke liye, Vo bhi bilkul " +
      toUnicodeVariant("FREE", "bold") +
      ". \n \nClick on the link below: \n";
    // template = template.replace;
    return template;
  }
  shareMessage = (item) => {
    const sessionShareMessage =
      item.shareMessage != null
        ? item.shareMessage
        : this.createShareMessage(item);
    Share.share({
      message: sessionShareMessage + this.state.referralLink,
    })
      .then((result) => {})
      .catch((errorMsg) => {});
  };

  render() {
    if (this.state.loader == true) {
      // return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
      return (
        <MaterialIndicator
          color="white"
          style={{ backgroundColor: "#0A1045" }}
        />
      );
    }
    const item = this.props.event;
    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 50,
              shadowColor: "black",
              shadowOffset: { height: 2 },
              shadowOpacity: 0.3,
              width: "100%",
              height: 300,
              justifyContent: "center",
            }}
          >
            <Image
              style={styles.cover}
              source={
                // cover
                { uri: item.coverImage }
                // require({cover})
              }
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                paddingLeft: 20,
                height: "180%",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  overflow: "hidden",
                  backgroundColor: "white",
                  padding: 4,
                  color: "black",
                  borderRadius: 4,
                }}
              >
                {item.seatsLeft} seats left
              </Text>
            </View>
          </View>

          <View style={{ margin: 20 }}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text h3 style={{ fontWeight: "bold", marginRight: "10%" }}>
                {item.eventName}
              </Text>
              <View
                style={{
                  marginLeft: "auto",
                  marginTop: "3%",
                }}
              >
                <TouchableOpacity onPress={this.shareMessage.bind(this, item)}>
                  <FontAwesomeIcon
                    icon={faShareAlt}
                    color={"black"}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* <Text h5 style={{ color: "grey", marginTop: 5 }}>
              {item.expertName}
            </Text> */}
            {/* <FontAwesomeIcon icon={ faClock } color={ 'white' } size={25} /> */}
            <View style={{ flexDirection: "row" }}>
              <FontAwesomeIcon
                icon={faClock}
                color={"grey"}
                size={15}
                style={{ marginTop: "6%" }}
              />
              <Text
                style={{
                  color: "grey",
                  marginTop: "5%",
                  fontSize: 15,
                  marginLeft: 5,
                }}
              >
                {this.loadDate(item.startTime)} -{}{" "}
                {this.loadDate(item.endTime)}
              </Text>
            </View>
            <View
              style={{
                marginTop: 2,
                borderBottomColor: "grey",
                borderBottomWidth: 1,
              }}
            />
            <Text
              style={{
                fontSize: 17,
                color: "grey",
                marginTop: 20,
                fontWeight: "bold",
              }}
            >
              About
            </Text>
            {item.description && (
              <Text style={{ fontSize: 17, color: "grey", marginTop: 10 }}>
                {item.description}
              </Text>
            )}
            {item.beautifulDescription && (
              <RenderHtml
                // contentWidth={width}
                source={{
                  html: item.beautifulDescription,
                  // html: item.description,
                }}
              />
            )}
            <View
              style={{
                marginTop: "5%",
                borderBottomColor: "grey",
                borderBottomWidth: 1,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
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
                  style={{ color: "#404040", fontSize: 13, paddingLeft: 10 }}
                >
                  {item.expertName}
                </Title>
              </View>
            </View>
          </View>
          <TambolaTicket
            event={this.props.event}
            phoneNumber={this.props.phoneNumber}
          />
        </ScrollView>

        <View style={{ margin: 15 }}>
          <Button
            disabled={this.isDisabled()}
            outline
            buttonStyle={{ backgroundColor: "#29BFC2" }}
            title={this.getTitle()}
            loading={this.state.loadingButton}
            onPress={
              item.costType == "paid" && this.getTitle() == "Book"
                ? this.razorPay.bind(this, item)
                : this.sessionAction.bind(this)
            }
          ></Button>
        </View>

        {item.recordingLink != null && (
          <Modal
            style={{}}
            animationType="slide"
            transparent={false}
            visible={this.state.videoVisible}
            onRequestClose={() => {
              this.setState({ videoVisible: false });
            }}
          >
            <WebView
              javaScriptEnabled={true}
              allowsFullscreenVideo
              style={{ flex: 1, borderColor: "red", borderWidth: 1 }}
              source={{
                uri: item.recordingLink,
              }}
            />
          </Modal>
        )}
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
  container1: {
    flex: 1,
    backgroundColor: "#0A1045",
  },
  input: {
    width: "90%",
    backgroundColor: "white",
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
  cover: {
    flex: 1,
    resizeMode: "cover",
    // marginTop:'-10%',
    // justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  btnTxt: {
    fontSize: 20,
    textAlign: "center",
    color: "black",
    fontWeight: "700",
  },
  registerTxt: {
    marginTop: 5,
    fontSize: 15,
    textAlign: "center",
    color: "white",
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    margin: 10,
    color: "white",
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
    color: "white",
    marginTop: 10,
    width: 160,
    opacity: 0.9,
    textAlign: "center",
  },
  newinput: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 10,
    color: "white",
    paddingHorizontal: 10,
  },
  container2: {
    padding: 25,
  },
  title2: {
    color: "white",
    marginTop: "30%",
    marginBottom: 10,
    opacity: 0.9,
    textAlign: "center",
    fontSize: 30,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
