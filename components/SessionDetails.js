import React, { Component } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Modal,
  SafeAreaView,
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
import { connect } from "react-redux";
import { Colors } from "../assets/colors/color.js";
import { hp, wp } from "../helpers/common.js";
import { storeCompletedSession } from "../services/Startup.js";
import { bindActionCreators } from "redux";
import { setMembership, setProfile } from "../redux/actions/counts.js";
import VoucherBottomSheet from "./VoucherBottomSheet.js";

class SessionDetails extends Component {
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
      belowAgePopUp: false,
      payButtonLoading: false,
      shareButtonLoading: false,
      nonMemberPopUp: false,
      lowCoinsPopUp: false,
      showVouchers: false,
      vouchers: [],
      voucherLoading: false,
      selectedVoucher: null,
    };
    this.retrieveData();
    this.modalRef = React.createRef();
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
      (title == "Cancel Your Booking" &&
        this.props.event.costType == "paid" &&
        this.props.event.startTime - new Date().getTime() < 60 * 60 * 1000)
    ) {
      return true;
    } else {
      return false;
    }
  }
  getTitle() {
    if (this.props.profile.age != null && this.props.profile.age < 50) {
      return "Share";
    }
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
    if (this.props.event.costType == "paid")
      return `Book with ${this.props.event.cost - this.getDiscountValue()} ${
        this.props.event.cost == 1 ? "coin" : "coins"
      }`;
    return "Book";
  }

  getDiscountValue() {
    const { selectedVoucher } = this.state;
    const { event } = this.props;
    if (!selectedVoucher) return 0;
    const { value, percent, limit } = selectedVoucher;
    if (value) {
      return value;
    }
    if (percent) {
      let discount = (event.cost * percent) / 100;
      return limit ? Math.min(discount, limit) : discount;
    }
    return 0;
  }

  handleBelowAge(item, url) {
    let link, shareMessage;
    link = url;
    shareMessage =
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
      .catch((errorMsg) => {
        console.log("error in sharing", errorMsg);
      });
  }
  checkTambola() {
    if (this.props.event.eventName.contains("Tambola")) {
      return true;
    }
    return false;
  }
  async sessionAction() {
    crashlytics().log(
      JSON.stringify(this.getTitle()) +
        JSON.stringify(this.props.alreadyBookedSameDayEvent)
    );
    if (this.getTitle() === "Share") {
      this.setState({ belowAgePopUp: true });
      return;
    }
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
      await storeCompletedSession(
        this.props.event.id,
        this.props.event.eventName,
        this.props.event.coverImage,
        this.props.event.subCategory,
        this.props.phoneNumber
      );
      setSessionAttended(this.props.phoneNumber);
      await Linking.openURL(this.props.event.meetingLink);
      await this.giveRewards();
      return;
    }

    var output = this.props.sessionAction("book", this.state.selectedVoucher);
    this.setState({ loadingButton: true });
  }
  async giveRewards(item) {
    let { membership, actions } = this.props;

    try {
      const response = await axios.post(`${SERVER_URL}/event/giveReward`, {
        phone: this.props.profile.phoneNumber,
        eventId: this.props.event.id,
      });
      membership.coins = response.data.coins;
      actions.setMembership({ ...membership });
    } catch (error) {
      console.log("Error in giveRewards ==>", error);
    }
  }
  isBookingAllowed() {
    if (this.props.membership.freeTrialActive == "true") return true;
    if (
      this.props.membership &&
      this.props.membership?.membershipType == "Free"
    ) {
      this.props.navigation.navigate("SubscriptionPlans");
      return false;
    } else if (
      this.props.membership &&
      this.props.membership?.coins < this.props.event.cost
    ) {
      this.setState({ lowCoinsPopUp: true });
      return false;
    }

    return true;
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
    if (this.props.profile.age != null && this.props.profile.age < 50) {
      this.handleBelowAge(
        item,
        "https://www.gohappyclub.in/session_details/" + item.id
      );
      return;
    }
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
  loadVouchers = async () => {
    try {
      this.setState({ voucherLoading: true });
      const response = await axios.post(
        `${SERVER_URL}/membership/getVouchers`,
        {
          phone: this.props.profile.phoneNumber,
        }
      );
      const eventsVouchers = response.data.filter(
        (voucher) =>
          voucher.category == `${this.props.event.type.toLowerCase()}s`
      );
      this.setState({ vouchers: eventsVouchers, voucherLoading: false });
    } catch (error) {
      this.setState({ voucherLoading: false });
      console.log("Error in getting rewards ==>", error);
    }
  };

  render() {
    if (this.state.loader == true) {
      return (
        <MaterialIndicator
          color={Colors.white}
          style={{ backgroundColor: Colors.materialIndicatorColor }}
        />
      );
    }
    const item = this.props.event;
    const tambolaHtml = this.tambolaParsing(item);
    return (
      <View
        style={{
          backgroundColor: Colors.white,
          flex: 1,
        }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{
            backgroundColor: Colors.white,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 50,
              shadowColor: Colors.black,
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
                  backgroundColor: Colors.white,
                  padding: 4,
                  color: Colors.black,
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
                    color={Colors.black}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* <Text h5 style={{ color: Colors.grey.grey, marginTop: 5 }}>
              {item.expertName}
            </Text> */}
            {/* <FontAwesomeIcon icon={ faClock } color={ 'white' } size={25} /> */}
            <View style={{ flexDirection: "row" }}>
              <FontAwesomeIcon
                icon={faClock}
                color={Colors.grey.grey}
                size={15}
                style={{ marginTop: "6%" }}
              />
              <Text
                style={{
                  color: Colors.grey.grey,
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
                borderBottomColor: Colors.grey.grey,
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
                      color: Colors.grey.grey,
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
                    <>
                      <RenderHtml
                        // contentWidth={width}
                        tagsStyles={contentHtmlStyles}
                        source={{
                          html: tambolaHtml,
                          // html: item.description,
                        }}
                      />
                      <View>
                        <Text>Note : Please draw the ticket on a Paper.</Text>
                      </View>
                    </>
                  )}
                  <View
                    style={{
                      marginTop: "5%",
                      borderBottomColor: Colors.grey.grey,
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
                color: Colors.grey.grey,
                marginTop: 20,
                fontWeight: "bold",
              }}
            >
              About
            </Text>
            {item.description && item.description.length > 0 && (
              <Text
                style={{
                  fontSize: 17,
                  color: Colors.grey.grey,
                  marginTop: "5%",
                }}
              >
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
                borderBottomColor: Colors.grey.grey,
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
                  style={{
                    color: Colors.grey["4"],
                    fontSize: 13,
                    paddingLeft: 10,
                  }}
                >
                  {item.expertName}
                </Title>
              </View>
            </View>
          </View>
        </ScrollView>
        <VoucherBottomSheet
          closeModal={() => {
            this.setState({ showVouchers: false });
            this.modalRef.current.snapToPosition(
              this.state.title.toLowerCase().startsWith("book") ? "13%" : "8%"
            );
          }}
          modalRef={this.modalRef}
          showVouchers={this.state.showVouchers}
          vouchers={this.state.vouchers}
          voucherLoading={this.state.voucherLoading}
          title={this.state.title}
          selectedVoucher={this.state.selectedVoucher}
          setSelectedVoucher={(newVoucher) =>
            this.setState({ selectedVoucher: newVoucher })
          }
          children={
            <SafeAreaView
              style={{
                backgroundColor: Colors.beige,
                paddingVertical: hp(1),
                paddingHorizontal: wp(3),
                borderTopRightRadius: wp(8),
                borderTopLeftRadius: wp(8),
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 5 },
                elevation: 100,
                width: wp(100),
                height: this.state.title.toLowerCase().startsWith("book")
                  ? hp(13)
                  : hp(8),
                gap: hp(1),
                justifyContent: "center",
              }}
            >
              {this.state.title.toLowerCase().startsWith("book") && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent:
                      this.state.selectedVoucher == null
                        ? "flex-end"
                        : "space-between",
                    alignItems: "center",
                    gap: wp(1),
                  }}
                >
                  {this.state.selectedVoucher == null ? (
                    <>
                      <Text>Have a voucher?</Text>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ showVouchers: true }, () => {
                            this.loadVouchers();
                          });
                          this.modalRef.current.snapToPosition("60%");
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.primary,
                            textDecorationLine: "underline",
                            // fontFamily: "Poppins-Regular",
                          }}
                        >
                          Apply Coupon
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontWeight: "bold",
                        }}
                      >
                        Code : {this.state.selectedVoucher.code}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ selectedVoucher: null });
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.primary,
                            textDecorationLine: "underline",
                            // fontFamily: "Poppins-Regular",
                          }}
                        >
                          Remove
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
              <SafeAreaView
                style={{
                  width: wp(100),
                  // margin: WIDTH * 0.02,
                  flexDirection:
                    this.state.title == "Cancel Your Booking"
                      ? "row"
                      : "column",
                  justifyContent:
                    this.state.title == "Cancel Your Booking"
                      ? "space-evenly"
                      : "center",
                  alignItems:
                    this.state.title == "Cancel Your Booking"
                      ? "center"
                      : "center",
                  gap: WIDTH * 0.02,
                }}
              >
                {this.state.title == "Cancel Your Booking" && (
                  <CountdownTimer
                    targetTime={item.startTime}
                    width={WIDTH * 0.1}
                    height={HEIGHT * 0.05}
                    separatorSize={WIDTH * 0.07}
                    showText={true}
                  />
                )}
                <Button
                  disabled={this.isDisabled()}
                  outline
                  buttonStyle={{
                    backgroundColor: Colors.primary,
                    minWidth: WIDTH * 0.55,
                    width: "100%",
                    minHeight: HEIGHT * 0.05,
                    alignSelf: "center",
                    alignContent: "center",
                  }}
                  title={this.getTitle()}
                  loading={this.state.loadingButton}
                  onPress={() => {
                    const title = this.getTitle();
                    this.setState({ title: title });
                    if (this.getTitle() === "Cancel Your Booking") {
                      this.setState({ showBookAlert: true });
                    } else if (
                      item.costType == "paid" &&
                      this.getTitle().startsWith("Book")
                    ) {
                      if (!this.isBookingAllowed()) return;
                      this.sessionAction();
                      return;
                    } else {
                      this.sessionAction();
                      return;
                    }
                  }}
                ></Button>
              </SafeAreaView>
            </SafeAreaView>
          }
        />
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
              style={{ flex: 1, borderColor: Colors.red, borderWidth: 1 }}
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
                      backgroundColor: Colors.errorButton,
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
            onDismiss={() => this.setState({ showBookAlert: false })}
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
                item,
                "https://www.gohappyclub.in/session_details/" + item.id
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
            confirmText="Join now"
            confirmButtonColor={Colors.primary}
            onConfirmPressed={() => {
              this.setState({ nonMemberPopUp: false });
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
            confirmText="Top up now"
            confirmButtonColor={Colors.primary}
            onConfirmPressed={() => {
              this.setState({ lowCoinsPopUp: false });
              this.props.navigation.navigate("TopUpScreen");
            }}
            onDismiss={() => this.setState({ lowCoinsPopUp: false })}
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
    borderColor: Colors.grey.c,
    marginBottom: 7,
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: Colors.grey.c,
  },
  td: {
    borderRightWidth: 1,
    borderColor: Colors.grey.c,
    padding: 5,
  },
});

const styles = StyleSheet.create({
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
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
export default connect(mapStateToProps, mapDispatchToProps)(SessionDetails);
