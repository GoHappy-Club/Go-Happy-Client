import React, { Component } from "react";
import {
  Dimensions,
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
import phonepe_payments from "./PhonePe/Payments.js";
import { WebView } from "react-native-webview";
import { Avatar, Title } from "react-native-paper";
import { Button, Text } from "react-native-elements";
import toUnicodeVariant from "./toUnicodeVariant.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { setSessionAttended } from "../services/events/EventService";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import RenderHtml from "react-native-render-html";
import firebase from "@react-native-firebase/app";
import { FirebaseDynamicLinksProps } from "../config/CONSTANTS";
import { format, fromUnixTime } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tambola from "tambola";
import CountdownTimer from "../commonComponents/countdown.js";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
export default class SessionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      showAlert: false,
      showBookAlert: false,
      showPaymentAlert: false,
      paymentAlertMessage: "Your Payment is Successful!",
      paymentAlertTitle: "Success",
      profileImage:
        "https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg",
      name: "",
      loadingButton: false,
      videoVisible: false,
      defaultCoverImage:
        "https://cdn.dnaindia.com/sites/default/files/styles/full/public/2019/09/05/865428-697045-senior-citizens-03.jpg",
      showCountdown: false,
      title: "",
    };
    this.retrieveData();
  }

  async phonePeWrapper(type, item) {
    var _this = this;
    const _callback = (id) => {
      this.setState({ success: true, loadingButton: false });

      var _this = this;
      if (id === "") {
        this.props.route.params.onGoBack();
        _this.props.navigation.navigate("GoHappy Club");
      } else {
        this.sessionAction();
        this.setState({ showPaymentAlert: true });
      }
    };
    const _errorHandler = () => {
      this.setState({
        paymentAlertMessage: phonepe_payments.PaymentError(),
        paymentAlertTitle: "Oops!",
      });
      this.setState({ showPaymentAlert: true });
    };
    if (type == "share") {
      const tambolaTicket = tambola.generateTicket();
      phonepe_payments
        .phonePeShare(
          this.props.phoneNumber,
          item.cost,
          _errorHandler,
          "workshop",
          item.id,
          tambolaTicket
        )
        .then((link) => {
          //prettier-ignore
          const message = `Hello from the GoHappy Club Family,
${toUnicodeVariant(
  this.state.name,
  "italic"
)} is requesting a payment of ₹${toUnicodeVariant(
            String(item.cost),
            "bold"
          )} for ${toUnicodeVariant(item.eventName, "bold")}.
Please make the payment using the link below:
${link}
${toUnicodeVariant("Note", "bold")}: The link will expire in 20 minutes.`;
          Share.share({
            message: message,
          })
            .then((result) => {
              this.setState({
                clickPopup: false,
              });
            })
            .catch((errorMsg) => {
              console.log("error in sharing", errorMsg);
            });
        });
    } else {
      phonepe_payments.phonePe(
        this.props.phoneNumber,
        item.cost,
        _callback,
        _errorHandler,
        "workshop"
      );
    }
  }

  retrieveData = async () => {
    const name = await AsyncStorage.getItem("name");
    this.setState({ name: name });
  };

  componentDidMount() {
    this.createDynamicReferralLink();
    this.setState({ loadingButton: false });
    const title = this.getTitle();
    this.setState({ title: title });
  }

  createDynamicReferralLink = async () => {
    let selfInviteCode = this.props.selfInviteCode;
    // alert('hi');
    crashlytics().log(JSON.stringify(this.props));
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
  };
  isDisabled() {
    var title = this.getTitle();
    if (
      title == "Seats Full" ||
      (title == "Cancel Your Booking" && this.props.event.costType == "paid")
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
      this.props.event.participantList != null &&
      this.props.phoneNumber != null &&
      this.props.event.participantList.includes(this.props.phoneNumber)
    ) {
      if (currTime > this.props.event.endTime) {
        return "View Recording";
      } else if (currTime + 600000 < this.props.event.startTime) {
        return "Cancel Your Booking";
      } else {
        return "Join";
      }
    }
    if (this.props.event.seatsLeft == 0) {
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
        JSON.stringify(this.props.alreadyBookedSameDayEvent)
    );
    if (
      this.getTitle() === "Book" &&
      this.props.alreadyBookedSameDayEvent == true
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
  }
  loadDate(item) {
    const dt = fromUnixTime(item / 1000);
    const finalTime = format(dt, "hh:mm a");
    return finalTime;
  }
  videoPlayer() {
    this.setState({ videoVisible: true });
  }
  async createShareMessage(item, url) {
    const sessionsTemplate =
      'Namaste !! I am attending "😃 ' +
      toUnicodeVariant(item.eventName, "bold italic") +
      ' 😃" session. Aap bhi join kr skte ho mere sath, super entertaining and informative session of ' +
      toUnicodeVariant("GoHappy Club", "bold") +
      ", apni life ke dusre padav ko aur productive and exciting bnane ke liye, Vo bhi bilkul " +
      toUnicodeVariant("FREE", "bold") +
      ". \n \nClick on the link below: \n" +
      url;

    const workshopTemplate =
      'Namaste !! I am attending "😃 ' +
      toUnicodeVariant(item.eventName, "bold italic") +
      ' 😃" workshop. Aap bhi join kr skte ho mere sath, super entertaining and informative workshop of ' +
      toUnicodeVariant("GoHappy Club", "bold") +
      ", apni life ke dusre padav ko aur productive and exciting bnane ke liye, " +
      `vo bhi sirf ${toUnicodeVariant(`\u20B9${item.cost}`, "bold")} mein` +
      ". \n \nClick on the link below: \n" +
      url;

    return item.costType == "paid" ? workshopTemplate : sessionsTemplate;
  }
  shareMessage = async (item) => {
    const sessionShareMessage =
      item.shareMessage != null
        ? item.shareMessage
        : await this.createShareMessage(
            item,
            "https://www.gohappyclub.in/session_details/" + item.id
          );
    Share.share({
      message: sessionShareMessage,
    })
      .then((result) => {})
      .catch((errorMsg) => {});
  };

  tambolaParsing = (item) => {
    var tic = new Array(10);
    for (var i = 0; i < tic.length; i++) {
      tic[i] = new Array(3);
    }
    if (
      item != null &&
      this.props.event.participantList != null &&
      this.props.event.participantList.length != 0
    ) {
      if (
        this.props.event.participantList.indexOf(this.props.phoneNumber) != -1
      ) {
        var jsonString =
          this.props.event.tambolaTickets[
            this.props.event.participantList.indexOf(this.props.phoneNumber)
          ];

        if (jsonString != null) {
          var temp = jsonString.match(/\d+/g);
          for (var i = 0; i < 9; i++) {
            tic[0][i] = parseInt(temp[i]);
            if (tic[0][i] == 0) {
              tic[0][i] = "";
            }
          }
          for (var i = 9; i < 18; i++) {
            tic[1][i - 9] = parseInt(temp[i]);
            if (tic[1][i - 9] == 0) {
              tic[1][i - 9] = "";
            }
          }
          for (var i = 18; i < 27; i++) {
            tic[2][i - 18] = parseInt(temp[i]);
            if (tic[2][i - 18] == 0) {
              tic[2][i - 18] = "";
            }
          }

          // jsonString = jsonString.replace('"','');
          // jsonString = jsonString.substr(1,jsonString.length-1);
          // tic = JSON.parse(jsonString);
        }
      }
    }
    //console.log("this is tic", tic[0]);
    var tambolaHtml =
      " <table align='center' border='1' style=\"border-collapse: collapse; width: 100%; font-size:10px\"><tbody>";

    tambolaHtml = tambolaHtml + "<tr>";
    tic[0].map((item) => {
      if (item != "") {
        tambolaHtml =
          tambolaHtml + "<td style='background-color: #fff'>" + item + "</td>";
      } else
        tambolaHtml =
          tambolaHtml +
          "<td style='background-color: #eda29b'>" +
          item +
          "</td>";
    });
    tambolaHtml = tambolaHtml + "</tr>";
    tambolaHtml = tambolaHtml + "<tr>";
    tic[1].map((item) => {
      if (item != "") {
        tambolaHtml =
          tambolaHtml + "<td style='background-color: #fff'>" + item + "</td>";
      } else
        tambolaHtml =
          tambolaHtml +
          "<td style='background-color: #eda29b'>" +
          item +
          "</td>";
    });
    tambolaHtml = tambolaHtml + "</tr>";
    tambolaHtml = tambolaHtml + "<tr>";
    tic[2].map((item) => {
      if (item != "") {
        tambolaHtml =
          tambolaHtml + "<td style='background-color: #fff'>" + item + "</td>";
      } else
        tambolaHtml =
          tambolaHtml +
          "<td style='background-color: #eda29b'>" +
          item +
          "</td>";
    });
    tambolaHtml = tambolaHtml + "</tr>";

    tambolaHtml = tambolaHtml + "</tbody></table>";
    //console.log("tam", tambolaHtml);
    return tambolaHtml;
  };

  render() {
    if (this.state.loader == true) {
      return (
        <MaterialIndicator
          color="white"
          style={{ backgroundColor: "#0A1045" }}
        />
      );
    }
    const item = this.props.event;
    const tambolaHtml = this.tambolaParsing(item);
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
            {this.props.event.eventName.indexOf("Tambola") >= 0 &&
              this.props.phoneNumber != null &&
              this.props.event.participantList != null &&
              this.props.event.participantList.indexOf(
                this.props.phoneNumber
              ) != -1 && (
                <>
                  <Text
                    style={{
                      fontSize: 17,
                      color: "grey",
                      marginTop: "5%",
                      fontWeight: "bold",
                      marginBottom: "3%",
                    }}
                  >
                    Tambola Ticket:{" "}
                    {this.props.event.participantList.indexOf(
                      this.props.phoneNumber
                    )}
                  </Text>

                  {tambolaHtml && (
                    <RenderHtml
                      // contentWidth={width}
                      tagsStyles={contentHtmlStyles}
                      source={{
                        html: tambolaHtml,
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
                </>
              )}
            {/* <TambolaTicket
              event={this.props.event}
              phoneNumber={this.props.phoneNumber}
            /> */}
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
            {item.description && item.description.length > 0 && (
              <Text style={{ fontSize: 17, color: "grey", marginTop: "5%" }}>
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
        </ScrollView>

        <View
          style={{
            margin: WIDTH * 0.02,
            flexDirection:
              this.state.title == "Cancel Your Booking" ? "row" : "column",
            justifyContent:
              this.state.title == "Cancel Your Booking"
                ? "space-evenly"
                : "center",
            alignItems:
              this.state.title == "Cancel Your Booking" ? "center" : "",
            gap: WIDTH*0.02,
          }}
        >
          {this.state.title == "Cancel Your Booking" && (
            <CountdownTimer
              targetTime={item.startTime}
              width={WIDTH * 0.1}
              height={HEIGHT * 0.05}
              textSize={HEIGHT * 0.02}
              separatorSize={WIDTH * 0.07}
              showText={true}
            />
          )}
          <Button
            disabled={this.isDisabled()}
            outline
            buttonStyle={{ backgroundColor: "#29BFC2", minWidth: WIDTH*0.55 }}
            title={this.getTitle()}
            loading={this.state.loadingButton}
            onPress={() => {
              const title = this.getTitle();
              this.setState({ title: title });
              if (this.getTitle() === "Cancel Your Booking") {
                this.setState({ showBookAlert: true });
              } else if (item.costType == "paid" && this.getTitle() == "Book") {
                this.setState({ clickPopup: true });
                return;
              } else {
                this.sessionAction();
                return;
              }
            }}
          ></Button>
        </View>
        {this.state.clickPopup && (
          <AwesomeAlert
            show={this.state.clickPopup}
            showProgress={false}
            title="Payment Confirmation"
            message="Would you like to pay this yourself or share the payment link with a family member?"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
            showConfirmButton={true}
            cancelText="Pay Now"
            confirmButtonColor="gray"
            cancelButtonColor="#29BFC2"
            onCancelPressed={() => {
              this.phonePeWrapper("self", item);
              this.setState({
                clickPopup: false,
              });
            }}
            confirmText="Share"
            showCancelButton={true}
            onConfirmPressed={() => {
              this.phonePeWrapper("share", item);
            }}
          />
        )}

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
        {this.state.showBookAlert && (
          <AwesomeAlert
            show={this.state.showBookAlert}
            showProgress={false}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            customView={
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: WIDTH * 0.058,
                    marginVertical: HEIGHT * 0.015,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Your session is starting in :
                </Text>
                <CountdownTimer targetTime={item.startTime} />
                <Text
                  style={{
                    fontSize: WIDTH * 0.04,
                    textAlign: "center",
                    marginVertical: HEIGHT * 0.015,
                  }}
                >
                  Are you sure you want to cancel your booking?
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: WIDTH * 0.5,
                  }}
                >
                  <Button
                    title="Yes"
                    buttonStyle={{
                      backgroundColor: "#DD6B55",
                      width: WIDTH * 0.2,
                    }}
                    onPress={() => {
                      this.setState({ showBookAlert: false });
                      this.sessionAction();
                    }}
                  />

                  <Button
                    title="No"
                    buttonStyle={{
                      backgroundColor: "#34983CAF",
                      width: WIDTH * 0.2,
                    }}
                    onPress={() => {
                      this.setState({ showBookAlert: false });
                    }}
                  />
                </View>
              </View>
            }
          />
        )}
      </View>
    );
  }
}

const contentHtmlStyles = StyleSheet.create({
  table: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#ccc",
    marginBottom: 7,
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  td: {
    borderRightWidth: 1,
    borderColor: "#ccc",
    padding: 5,
  },
});

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
