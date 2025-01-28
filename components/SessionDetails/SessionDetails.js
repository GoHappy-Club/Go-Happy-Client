import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
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
import toUnicodeVariant from "../toUnicodeVariant.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { setSessionAttended } from "../../services/events/EventService";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import RenderHtml from "react-native-render-html";
import firebase from "@react-native-firebase/app";
import { FirebaseDynamicLinksProps } from "../../config/CONSTANTS";
import { format, fromUnixTime } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountdownTimer from "../../commonComponents/countdown.js";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../assets/colors/color.js";
import { hp, wp } from "../../helpers/common.js";
import { storeCompletedSession } from "../../services/Startup.js";
import VoucherBottomSheet from "../Rewards/VoucherBottomSheet.js";
import { useNavigation, useRoute } from "@react-navigation/native";
import phonepe_payments from "../PhonePe/Payments.js";
import tambola from "tambola";
import FastImage from "react-native-fast-image";

const SessionDetails = ({
  route,
  navigation,
  sessionAction,
  event,
  phoneNumber,
  alreadyBookedSameDayEvent,
  type,
  selfInviteCode,
  setResultantCost,
}) => {
  const [state, setState] = useState({
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
    referralLink: "",
    payButtonLoading: false,
    shareButtonLoading: false,
    nonMemberPopUp: false,
    lowCoinsPopUp: false,
    showVouchers: false,
    vouchers: [],
    voucherLoading: false,
    selectedVoucher: null,
    payButtonLoading: false,
    shareButtonLoading: false,
    paymentSharePopUp: false,
  });

  const modalRef = useRef();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state.membership.membership);

  useEffect(() => {
    retrieveData();
    createDynamicReferralLink();
    setState((prevState) => ({
      ...prevState,
      loadingButton: false,
      title: getTitle(),
    }));
  }, []);

  const retrieveData = async () => {
    const name = await AsyncStorage.getItem("name");
    setState((prevState) => ({ ...prevState, name }));
  };

  const phonePeWrapper = async (type, item) => {
    const _callback = (id) => {
      setState((prev) => ({ ...prev, success: true, loadingButton: false }));

      if (id === "") {
        route.params.onGoBack();
        navigation.navigate("GoHappy Club");
      } else {
        sessionActionL();
        setState((prev) => ({
          ...prev,
          showPaymentAlert: true,
          clickPopup: false,
          payButtonLoading: false,
          paymentSharePopUp: false,
        }));
      }
    };
    const _errorHandler = () => {
      setState((prev) => ({
        ...prev,
        paymentAlertMessage: phonepe_payments.PaymentError(),
        paymentAlertTitle: "Oops!",
        clickPopup: false,
        payButtonLoading: false,
        showPaymentAlert: true,
        paymentSharePopUp: false,
      }));
    };
    if (type == "share") {
      setState((prev) => ({ ...prev, shareButtonLoading: true }));
      const tambolaTicket = tambola.generateTicket();
      phonepe_payments
        .phonePeShare(
          profile.phoneNumber,
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
  state.name,
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
              setState((prev) => ({
                ...prev,
                shareButtonLoading: false,
                clickPopup: false,
                showPaymentAlert: false,
                paymentSharePopUp: false,
              }));
            })
            .catch((errorMsg) => {
              console.log("error in sharing", errorMsg);
            });
        });
    } else {
      setState((prev) => ({ ...prev, payButtonLoading: true }));
      phonepe_payments.phonePe(
        profile.phoneNumber,
        item.cost,
        _callback,
        _errorHandler,
        "workshop"
      );
    }
  };

  const extractMeetingNumber = (url) => {
    const regex = /j\/(\d+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  };

  const joinMeeting = async () => {
    try {
      Linking.openURL(event.meetingLink);
    } catch (e) {
      console.log(e);
      Alert.alert("" + e);
    }
  };

  const createDynamicReferralLink = async () => {
    let inviteCode = selfInviteCode || "test";
    const link1 = await firebase.dynamicLinks().buildShortLink(
      {
        link: FirebaseDynamicLinksProps().link + inviteCode,
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

    setState((prevState) => ({ ...prevState, referralLink: link1 }));
  };

  const isDisabled = () => {
    const title = getTitle();
    if (
      title == "Cancel Your Booking" &&
      event?.type?.toLowerCase() == "workshop"
    )
      return true;
    if (
      title == "Seats Full" ||
      (title == "Cancel Your Booking" &&
        event.costType == "paid" &&
        event.startTime - new Date().getTime() < 60 * 60 * 1000)
    ) {
      return true;
    } else {
      return false;
    }
  };
  const getTitle = () => {
    if (profile.age != null && profile.age < 50) {
      return "Share";
    }
    const currTime = Date.now();
    if (type == "expired") {
      return "View Recording";
    }
    if (type == "ongoing") {
      return "Join";
    }
    if (
      event.participantList != null &&
      phoneNumber != null &&
      event.participantList.includes(phoneNumber)
    ) {
      if (currTime > event.endTime) {
        return "View Recording";
      } else if (currTime + 600000 < event.startTime) {
        return "Cancel Your Booking";
      } else {
        return "Join";
      }
    }
    if (event.seatsLeft == 0) {
      return "Seats Full";
    }
    if (event?.type?.toLowerCase() == "workshop") {
      return `Book with Rs.${event.cost}`;
    }
    if (event.costType == "paid")
      return `Book with ${event.cost - getDiscountValue()} ${
        event.cost == 1 ? "coin" : "coins"
      }`;
    return "Book";
  };

  const getDiscountValue = () => {
    const { selectedVoucher } = state;
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
  };

  const handleBelowAge = (item, url) => {
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
  };
  const sessionActionL = async () => {
    crashlytics().log(
      JSON.stringify(getTitle()) + JSON.stringify(alreadyBookedSameDayEvent)
    );
    if (getTitle() === "Share") {
      setState((prev) => ({ ...prev, belowAgePopUp: true }));
      return;
    }
    if (
      getTitle().toLowerCase().startsWith("book") &&
      alreadyBookedSameDayEvent == true
    ) {
      setState((prev) => ({ ...prev, showAlert: true }));
      return;
    }
    if (getTitle() === "View Recording") {
      videoPlayer();
      return;
    }
    if (getTitle() === "Join") {
      await storeCompletedSession(
        event.id,
        event.eventName,
        event.coverImage,
        event.subCategory,
        phoneNumber,
        event.endTime
      );
      setSessionAttended(phoneNumber);
      // await Linking.openURL(event.meetingLink);
      joinMeeting();
      return;
    }

    var output = sessionAction("book", state.selectedVoucher);
    setState((prev) => ({ ...prev, loadingButton: true }));
  };

  const giveRewards = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/event/giveReward`, {
        phone: profile.phoneNumber,
        eventId: event.id,
      });
    } catch (error) {
      console.log("Error in giveRewards ==>", error);
      crashlytics().log(`Error in giveRewards SessionDetails ${error}`);
    }
  };

  const isBookingAllowed = () => {
    if (membership.freeTrialActive == true) return true;
    if (membership && membership?.membershipType == "Free") {
      navigation.navigate("SubscriptionPlans");
      return false;
    } else if (membership && membership?.coins < event.cost) {
      setState((prev) => ({ ...prev, lowCoinsPopUp: true }));
      return false;
    }

    return true;
  };
  const loadDate = (item) => {
    const dt = fromUnixTime(item / 1000);
    const finalTime = format(dt, "hh:mm a");
    return finalTime;
  };
  const videoPlayer = () => {
    setState((prev) => ({ ...prev, videoVisible: true }));
  };
  const createShareMessage = async (item, url) => {
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
  };

  const shareMessage = async (item) => {
    if (profile.age != null && profile.age < 50) {
      handleBelowAge(
        item,
        "https://www.gohappyclub.in/session_details/" + item.id
      );
      return;
    }
    const sessionShareMessage =
      item.shareMessage != null
        ? item.shareMessage
        : await createShareMessage(
            item,
            "https://www.gohappyclub.in/session_details/" + item.id
          );
    Share.share({
      message: sessionShareMessage,
    })
      .then((result) => {})
      .catch((errorMsg) => {});
  };
  const tambolaParsing = (item) => {
    var tic = new Array(10);
    for (var i = 0; i < tic.length; i++) {
      tic[i] = new Array(3);
    }
    if (
      item != null &&
      event.participantList != null &&
      event.participantList.length != 0
    ) {
      if (event.participantList.indexOf(phoneNumber) != -1) {
        var jsonString =
          event.tambolaTickets[event.participantList.indexOf(phoneNumber)];

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

  const loadVouchers = async () => {
    try {
      setState((prev) => ({ ...prev, voucherLoading: true }));
      const response = await axios.post(
        `${SERVER_URL}/membership/getVouchers`,
        {
          phone: profile.phoneNumber,
        }
      );
      const eventsVouchers = response.data.filter(
        (voucher) => voucher.category == `${event.type.toLowerCase()}s`
      );
      setState((prev) => ({
        ...prev,
        vouchers: eventsVouchers,
        voucherLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, voucherLoading: false }));
      console.log("Error in getting rewards ==>", error);
      crashlytics().log(`Error in loadVouchers SessionDetails ${error}`);
    }
  };

  const item = event;
  const tambolaHtml = tambolaParsing(item);
  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.background,
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          backgroundColor: Colors.background,
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
          <FastImage
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
              <TouchableOpacity onPress={() => shareMessage(item)}>
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
              {loadDate(item.startTime)} -{} {loadDate(item.endTime)}
            </Text>
          </View>
          <View
            style={{
              marginTop: 2,
              borderBottomColor: Colors.grey.grey,
              borderBottomWidth: 1,
            }}
          />
          {event.eventName.indexOf("Tambola") >= 0 &&
            phoneNumber != null &&
            event.participantList != null &&
            event.participantList.indexOf(phoneNumber) != -1 && (
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
                  Tambola Ticket: {event.participantList.indexOf(phoneNumber)}
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
              event={event}
              phoneNumber={phoneNumber}
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
              <FastImage
                source={
                  item.expertImage
                    ? {
                        uri: item.expertImage,
                      }
                    : require("../../images/profile_image.jpeg")
                }
                style={{ width: 30, height: 30, borderRadius: 20 }}
                resizeMode="cover"
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
          setState((prev) => ({ ...prev, showVouchers: false }));
          modalRef.current.snapToPosition(
            state?.title?.toLowerCase()?.startsWith("book") ? "13%" : "8%"
          );
        }}
        modalRef={modalRef}
        showVouchers={state.showVouchers}
        vouchers={state.vouchers}
        voucherLoading={state.voucherLoading}
        title={state.title}
        selectedVoucher={state.selectedVoucher}
        costType={event.costType}
        setSelectedVoucher={(newVoucher) =>
          setState((prev) => ({ ...prev, selectedVoucher: newVoucher }))
        }
        children={
          <SafeAreaView
            style={{
              backgroundColor: Colors.bottomNavigation,
              paddingVertical: hp(1),
              paddingHorizontal: wp(3),
              borderTopRightRadius: wp(8),
              borderTopLeftRadius: wp(8),
              shadowColor: Colors.black,
              shadowOffset: { width: 0, height: 5 },
              elevation: 100,
              width: wp(100),
              height:
                state?.title?.toLowerCase().startsWith("book") &&
                event.costType == "paid"
                  ? hp(13)
                  : hp(8),
              gap: hp(1),
              justifyContent: "center",
            }}
          >
            {state?.title?.toLowerCase().startsWith("book") && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent:
                    state.selectedVoucher == null
                      ? "flex-end"
                      : "space-between",
                  alignItems: "center",
                  gap: wp(1),
                }}
              >
                {state.selectedVoucher == null && event.costType == "paid" ? (
                  <>
                    <Text>Have a voucher?</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setState((prev) => ({ ...prev, showVouchers: true }));
                        loadVouchers();
                        modalRef.current.snapToPosition("60%");
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.primary,
                          textDecorationLine: "underline",
                        }}
                      >
                        Apply Coupon
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  event.costType == "paid" && (
                    <>
                      <Text
                        style={{
                          fontFamily: "Poppins-Regular",
                          fontWeight: "bold",
                        }}
                      >
                        Code : {state?.selectedVoucher?.code}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setState((prev) => ({
                            ...prev,
                            selectedVoucher: null,
                          }));
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.primary,
                            textDecorationLine: "underline",
                          }}
                        >
                          Remove
                        </Text>
                      </TouchableOpacity>
                    </>
                  )
                )}
              </View>
            )}
            <SafeAreaView
              style={{
                width: Platform.OS == "ios" ? wp(100) : "",
                flexDirection:
                  state.title == "Cancel Your Booking" ? "row" : "column",
                justifyContent:
                  state.title == "Cancel Your Booking"
                    ? "space-evenly"
                    : "center",
                alignItems:
                  state.title == "Cancel Your Booking"
                    ? "center"
                    : Platform.OS == "ios"
                      ? "center"
                      : "",
                // gap: WIDTH * 0.02,
              }}
            >
              {state.title == "Cancel Your Booking" && (
                <CountdownTimer
                  targetTime={item.startTime}
                  width={WIDTH * 0.1}
                  height={HEIGHT * 0.05}
                  separatorSize={WIDTH * 0.07}
                  showText={true}
                />
              )}
              <Button
                disabled={isDisabled()}
                outline
                buttonStyle={{
                  backgroundColor: Colors.primary,
                  // minWidth: WIDTH * 0.55,
                  width:
                    getTitle().toLowerCase() == "cancel your booking"
                      ? "auto"
                      : "100%",
                  minHeight: HEIGHT * 0.05,
                }}
                title={getTitle()}
                loading={state.loadingButton}
                onPress={() => {
                  const title = getTitle();
                  setState((prev) => ({ ...prev, title: title }));
                  if (getTitle() === "Cancel Your Booking") {
                    setState((prev) => ({ ...prev, showBookAlert: true }));
                  } else if (
                    item.costType == "paid" &&
                    getTitle().startsWith("Book")
                  ) {
                    if (event?.type?.toLowerCase() == "workshop") {
                      setState((prev) => ({
                        ...prev,
                        paymentSharePopUp: true,
                      }));
                      return;
                    }
                    if (!isBookingAllowed()) return;
                    sessionActionL();
                    return;
                  } else {
                    sessionActionL();
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
          visible={state.videoVisible}
          onRequestClose={() => {
            setState((prev) => ({ ...prev, videoVisible: false }));
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
      {state.paymentSharePopUp && (
        <AwesomeAlert
          show={state.paymentSharePopUp}
          showProgress={false}
          closeOnTouchOutside={
            state.payButtonLoading || state.shareButtonLoading ? false : true
          }
          customView={
            <View style={styles.AAcontainer}>
              <Text style={styles.AAtitle}>Payment Confirmation</Text>
              <Text style={styles.AAmessage}>
              Click below to pay.
              </Text>
              <View style={styles.AAbuttonContainer}>
                <Button
                  outline
                  title={"Pay Now"}
                  loading={state.payButtonLoading}
                  buttonStyle={[styles.AApayButton, styles.AAbutton]}
                  onPress={() => {
                    phonePeWrapper("self", item);
                  }}
                  disabled={state.payButtonLoading}
                  loadingStyle={{
                    color: Colors.black,
                  }}
                />
                {/* <Button
                  outline
                  title={"Share"}
                  loading={state.shareButtonLoading}
                  buttonStyle={[styles.AAshareButton, styles.AAbutton]}
                  onPress={() => {
                    phonePeWrapper("share", item);
                  }}
                  disabled={state.shareButtonLoading}
                /> */}
              </View>
            </View>
          }
          onDismiss={() => {
            setState((prev) => ({ ...prev, paymentSharePopUp: false }));
          }}
        />
      )}
      {state.showAlert && (
        <AwesomeAlert
          show={state.showAlert}
          showProgress={false}
          title="Oops!"
          message="You have already booked the same session for this date. Please cancel your booking of the other session and try again."
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Try Again"
          confirmButtonColor={Colors.errorButton}
          onConfirmPressed={() => {
            setState((prev) => ({ ...prev, showAlert: false }));
          }}
          onDismiss={() => setState((prev) => ({ ...prev, showAlert: false }))}
        />
      )}
      {state.showPaymentAlert && (
        <AwesomeAlert
          show={state.showPaymentAlert}
          showProgress={false}
          title={state.paymentAlertTitle}
          message={state.paymentAlertMessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor={Colors.errorButton}
          onConfirmPressed={() => {
            setState((prev) => ({
              ...prev,
              showPaymentAlert: false,
              paymentAlertMessage: "Your Payment is Successful!",
              paymentAlertTitle: "Success",
            }));
          }}
          onDismiss={() =>
            setState((prev) => ({ ...prev, showPaymentAlert: false }))
          }
        />
      )}
      {state.showBookAlert && (
        <AwesomeAlert
          show={state.showBookAlert}
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
                    setState((prev) => ({ ...prev, showBookAlert: false }));
                    sessionActionL();
                  }}
                />

                <Button
                  title="No"
                  buttonStyle={{
                    backgroundColor: "#34983CAF",
                    width: WIDTH * 0.2,
                  }}
                  onPress={() => {
                    setState((prev) => ({ ...prev, showBookAlert: false }));
                  }}
                />
              </View>
            </View>
          }
          onDismiss={() =>
            setState((prev) => ({ ...prev, showBookAlert: false }))
          }
        />
      )}
      {state.belowAgePopUp && (
        <AwesomeAlert
          show={state.belowAgePopUp}
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
            handleBelowAge(
              item,
              "https://www.gohappyclub.in/session_details/" + item.id
            );
            setState((prev) => ({ ...prev, belowAgePopUp: false }));
          }}
          onDismiss={() =>
            setState((prev) => ({ ...prev, belowAgePopUp: false }))
          }
        />
      )}
      {state.nonMemberPopUp && (
        <AwesomeAlert
          show={state.nonMemberPopUp}
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
            setState((prev) => ({ ...prev, nonMemberPopUp: false }));
            navigation.navigate("SubscriptionPlans");
          }}
          onDismiss={() =>
            setState((prev) => ({ ...prev, nonMemberPopUp: false }))
          }
        />
      )}
      {state.lowCoinsPopUp && (
        <AwesomeAlert
          show={state.lowCoinsPopUp}
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
            setState((prev) => ({ ...prev, lowCoinsPopUp: false }));
            navigation.navigate("TopUpScreen");
          }}
          onDismiss={() =>
            setState((prev) => ({ ...prev, lowCoinsPopUp: false }))
          }
        />
      )}
    </SafeAreaView>
  );
  // }
};

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

export default SessionDetails;
