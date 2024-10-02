import React, { useState, useEffect } from "react";
import {
  Alert,
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
import { faClock, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { setZoomToken } from "../redux/actions/counts.js";
import { setSessionAttended } from "../services/events/EventService";
import RenderHtml from "react-native-render-html";
import firebase from "@react-native-firebase/app";
import { FirebaseDynamicLinksProps } from "../config/CONSTANTS";
import { format, fromUnixTime } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tambola from "tambola";
import CountdownTimer from "../commonComponents/countdown.js";
import { Colors } from "../assets/colors/color.js";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIndicator } from "react-native-indicators";
import { generateZoomSignature } from "../services/zoom/zoomTokenGenerator.js";
import { useZoom } from "zoom-msdk-rn";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const SessionDetails = ({ route, navigation, sessionAction, event, phoneNumber, alreadyBookedSameDayEvent,type, selfInviteCode }) => {
  const [state, setState] = useState({
    modalVisible: false,
    showAlert: false,
    showBookAlert: false,
    showPaymentAlert: false,
    paymentAlertMessage: "Your Payment is Successful!",
    paymentAlertTitle: "Success",
    profileImage: "https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg",
    name: "",
    loadingButton: false,
    videoVisible: false,
    defaultCoverImage: "https://cdn.dnaindia.com/sites/default/files/styles/full/public/2019/09/05/865428-697045-senior-citizens-03.jpg",
    showCountdown: false,
    title: "",
    belowAgePopUp: false,
    clickPopup: false,
    referralLink: "",
  });
  const dispatch = useDispatch();
  const profile = useSelector((state)=>state.profile.profile)
  const zoom = useZoom();

  useEffect(() => {
    retrieveData();
    createDynamicReferralLink();
    setState(prevState => ({ ...prevState, loadingButton: false, title: getTitle() }));
  }, []);

  const retrieveData = async () => {
    const name = await AsyncStorage.getItem("name");
    setState(prevState => ({ ...prevState, name }));
  };

  const extractMeetingNumber = (url)=>{
    const regex = /j\/(\d+)/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  }

  const joinMeeting = async () => {
    const sdkJwt = generateZoomSignature();
    dispatch(setZoomToken(sdkJwt));    
    try {
      await zoom.joinMeeting({
        userName: profile.name,
        meetingNumber: extractMeetingNumber(event.meetingLink),
        password: "12345",
      });
    } catch (e) {
      console.log(e);
      Alert.alert('' + e);
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
          fallbackUrl: "https://play.google.com/store/apps/details?id=com.gohappyclient",
        },
      },
      firebase.dynamicLinks.ShortLinkType.SHORT
    );

    setState(prevState => ({ ...prevState, referralLink: link1 }));
  };

  const phonePeWrapper = async (type, item) => {
    const _callback = (id) => {
      setState(prevState => ({ ...prevState, success: true, loadingButton: false }));
      if (id === "") {
        route.params.onGoBack();
        navigation.navigate("GoHappy Club");
      } else {
        sessionActionL();
        setState(prevState => ({ ...prevState, showPaymentAlert: true }));
      }
    };

    const _errorHandler = () => {
      setState(prevState => ({
        ...prevState,
        paymentAlertMessage: phonepe_payments.PaymentError(),
        paymentAlertTitle: "Oops!",
        showPaymentAlert: true,
      }));
    };

    if (type === "share") {
      const tambolaTicket = tambola.generateTicket();
      const link = await phonepe_payments.phonePeShare(
        phoneNumber,
        item.cost,
        _errorHandler,
        "workshop",
        item.id,
        tambolaTicket
      );

      const message = `Hello from the GoHappy Club Family,
${toUnicodeVariant(state.name, "italic")} is requesting a payment of ₹${toUnicodeVariant(String(item.cost), "bold")} for ${toUnicodeVariant(item.eventName, "bold")}.
Please make the payment using the link below:
${link}
${toUnicodeVariant("Note", "bold")}: The link will expire in 20 minutes.`;

      try {
        await Share.share({ message });
        setState(prevState => ({ ...prevState, clickPopup: false }));
      } catch (error) {
        console.log("error in sharing", error);
      }
    } else {
      phonepe_payments.phonePe(phoneNumber, item.cost, _callback, _errorHandler, "workshop");
    }
  };

  const isDisabled = () => {
    const title = getTitle();
    return title === "Seats Full" || (title === "Cancel Your Booking" && event.costType === "paid");
  };

  const getTitle = () => {
    if (profile.age != null && profile.age < 50) {
      return "Share";
    }
    const currTime = Date.now();
    if (type === "expired") {
      return "View Recording";
    }
    if (type === "ongoing") {
      return "Join";
    }
    if (event.participantList != null && phoneNumber != null && event.participantList.includes(phoneNumber)) {
      if (currTime > event.endTime) {
        return "View Recording";
      } else if (currTime + 600000 < event.startTime) {
        return "Cancel Your Booking";
      } else {
        return "Join";
      }
    }
    if (event.seatsLeft === 0) {
      return "Seats Full";
    }
    return "Book";
  };

  const handleBelowAge = (item, url) => {
    const shareMessage = "👋 Hi! A new session is starting at GoHappy Club, which is very useful and interesting for seniors. \n\n" +
      "📚 The name of the session is *" + toUnicodeVariant(item.eventName, "bold italic") + "*.\n\n" +
      "I think you will definitely like it! 😊 \n\n" +
      "👉 Here is the link to the session: \n" + url + ".\n\n" +
      "💬 Join in and let me know how you liked it! 👍";

    Share.share({ message: shareMessage })
      .then((result) => {})
      .catch((errorMsg) => {
        console.log("error in sharing", errorMsg);
      });
  };

  const sessionActionL = () => {
    if (getTitle() === "Share") {
      setState(prevState => ({ ...prevState, belowAgePopUp: true }));
      return;
    }
    if (getTitle() === "Book" && alreadyBookedSameDayEvent === true) {
      setState(prevState => ({ ...prevState, showAlert: true }));
      return;
    }
    if (getTitle() === "View Recording") {
      setState(prevState => ({ ...prevState, videoVisible: true }));
      return;
    }
    if (getTitle() === "Join") {
      setSessionAttended(phoneNumber);
      // Linking.openURL(event.meetingLink);
      joinMeeting();
      return;
    }

    sessionAction("book");
    setState(prevState => ({ ...prevState, loadingButton: true }));
  };

  const loadDate = (time) => {
    const dt = fromUnixTime(time / 1000);
    return format(dt, "hh:mm a");
  };

  const createShareMessage = async (item, url) => {
    const sessionsTemplate = `Namaste !! I am attending "😃 ${toUnicodeVariant(item.eventName, "bold italic")} 😃" session. Aap bhi join kr skte ho mere sath, super entertaining and informative session of ${toUnicodeVariant("GoHappy Club", "bold")}, apni life ke dusre padav ko aur productive and exciting bnane ke liye, Vo bhi bilkul ${toUnicodeVariant("FREE", "bold")}. \n \nClick on the link below: \n${url}`;

    const workshopTemplate = `Namaste !! I am attending "😃 ${toUnicodeVariant(item.eventName, "bold italic")} 😃" workshop. Aap bhi join kr skte ho mere sath, super entertaining and informative workshop of ${toUnicodeVariant("GoHappy Club", "bold")}, apni life ke dusre padav ko aur productive and exciting bnane ke liye, vo bhi sirf ${toUnicodeVariant(`\u20B9${item.cost}`, "bold")} mein. \n \nClick on the link below: \n${url}`;

    return item.costType === "paid" ? workshopTemplate : sessionsTemplate;
  };

  const shareMessage = async (item) => {
    if (profile.age != null && profile.age < 50) {
      handleBelowAge(item, "https://www.gohappyclub.in/session_details/" + item.id);
      return;
    }
    const sessionShareMessage = item.shareMessage != null
      ? item.shareMessage
      : await createShareMessage(item, "https://www.gohappyclub.in/session_details/" + item.id);

    Share.share({ message: sessionShareMessage })
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
      if (
        event.participantList.indexOf(phoneNumber) != -1
      ) {
        var jsonString =
          event.tambolaTickets[
            event.participantList.indexOf(phoneNumber)
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

  if (state.loader == true) {
    return (
      <MaterialIndicator
        color={Colors.white}
        style={{ backgroundColor: Colors.materialIndicatorColor }}
      />
    );
  }

  // Render method becomes the main component body
  const item = event;
  const tambolaHtml = tambolaParsing(item);

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: Colors.white }}>
        <View style={{
          backgroundColor: Colors.white,
          borderRadius: 50,
          shadowColor: Colors.black,
          shadowOffset: { height: 2 },
          shadowOpacity: 0.3,
          width: "100%",
          height: 300,
          justifyContent: "center",
        }}>
          <Image style={styles.cover} source={{ uri: event.coverImage }} />
          <View style={{
            position: "absolute",
            top: 0,
            paddingLeft: 20,
            height: "180%",
            alignItems: "flex-start",
            justifyContent: "center",
          }}>
            <Text style={{
              overflow: "hidden",
              backgroundColor: Colors.white,
              padding: 4,
              color: Colors.black,
              borderRadius: 4,
            }}>
              {event.seatsLeft} seats left
            </Text>
          </View>
        </View>

        <View style={{ margin: 20 }}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text h3 style={{ fontWeight: "bold", marginRight: "10%" }}>
              {event.eventName}
            </Text>
            <View style={{ marginLeft: "auto", marginTop: "3%" }}>
              <TouchableOpacity onPress={() => shareMessage(event)}>
                <FontAwesomeIcon icon={faShareAlt} color={Colors.black} size={25} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <FontAwesomeIcon icon={faClock} color={Colors.grey.grey} size={15} style={{ marginTop: "6%" }} />
            <Text style={{
              color: Colors.grey.grey,
              marginTop: "5%",
              fontSize: 15,
              marginLeft: 5,
            }}>
              {loadDate(event.startTime)} - {loadDate(event.endTime)}
            </Text>
          </View>
          <View style={{
            marginTop: 2,
            borderBottomColor: Colors.grey.grey,
            borderBottomWidth: 1,
          }} />

          {event.eventName.indexOf("Tambola") >= 0 &&
            phoneNumber != null &&
            event.participantList != null &&
            event.participantList.indexOf(phoneNumber) != -1 && (
              <>
                <Text style={{
                  fontSize: 17,
                  color: Colors.grey.grey,
                  marginTop: "5%",
                  fontWeight: "bold",
                  marginBottom: "3%",
                }}>
                  Tambola Ticket: {event.participantList.indexOf(phoneNumber)}
                </Text>

                {tambolaHtml && (
                  <>
                    <RenderHtml
                      tagsStyles={contentHtmlStyles}
                      source={{
                        html: tambolaHtml,
                      }}
                    />
                    <View>
                      <Text>Note: Please draw the ticket on a Paper.</Text>
                    </View>
                  </>
                )}
                <View style={{
                  marginTop: "5%",
                  borderBottomColor: Colors.grey.grey,
                  borderBottomWidth: 1,
                }} />
              </>
            )}

          <Text style={{
            fontSize: 17,
            color: Colors.grey.grey,
            marginTop: 20,
            fontWeight: "bold",
          }}>
            About
          </Text>
          {event.description && event.description.length > 0 && (
            <Text style={{
              fontSize: 17,
              color: Colors.grey.grey,
              marginTop: "5%",
            }}>
              {event.description}
            </Text>
          )}
          {event.beautifulDescription && (
            <RenderHtml
              source={{
                html: event.beautifulDescription,
              }}
            />
          )}
          <View style={{
            marginTop: "5%",
            borderBottomColor: Colors.grey.grey,
            borderBottomWidth: 1,
          }} />
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Avatar.Image
                source={
                  event.expertImage
                    ? { uri: event.expertImage }
                    : require("../images/profile_image.jpeg")
                }
                size={30}
              />
              <Title style={{
                color: Colors.grey["4"],
                fontSize: 13,
                paddingLeft: 10,
              }}>
                {event.expertName}
              </Title>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={{
        margin: WIDTH * 0.02,
        flexDirection: state.title === "Cancel Your Booking" ? "row" : "column",
        justifyContent: state.title === "Cancel Your Booking" ? "space-evenly" : "center",
        alignItems: state.title === "Cancel Your Booking" ? "center" : "",
        gap: WIDTH * 0.02,
      }}>
        {state.title === "Cancel Your Booking" && (
          <CountdownTimer
            targetTime={event.startTime}
            width={WIDTH * 0.1}
            height={HEIGHT * 0.05}
            textSize={HEIGHT * 0.02}
            separatorSize={WIDTH * 0.07}
            showText={true}
          />
        )}
        <Button
          disabled={isDisabled()}
          outline
          buttonStyle={{
            backgroundColor: Colors.primary,
            minWidth: WIDTH * 0.55,
          }}
          title={getTitle()}
          loading={state.loadingButton}
          onPress={() => {
            const title = getTitle();
            setState(prevState => ({ ...prevState, title }));
            if (title === "Cancel Your Booking") {
              setState(prevState => ({ ...prevState, showBookAlert: true }));
            } else if (event.costType === "paid" && title === "Book") {
              setState(prevState => ({ ...prevState, clickPopup: true }));
            } else {
              sessionActionL();
            }
          }}
        />
      </View>

      {state.clickPopup && (
        <AwesomeAlert
          show={state.clickPopup}
          showProgress={false}
          title="Payment Confirmation"
          message="Would you like to pay this yourself or share the payment link with a family member?"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showConfirmButton={true}
          cancelText="Pay Now"
          confirmButtonColor={Colors.grey.grey}
          cancelButtonColor={Colors.primary}
          onCancelPressed={() => {
            phonePeWrapper("self", event);
            setState(prevState => ({ ...prevState, clickPopup: false }));
          }}
          confirmText="Share"
          showCancelButton={true}
          onConfirmPressed={() => {
            phonePeWrapper("share", event);
          }}
        />
      )}

      {event.recordingLink != null && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={state.videoVisible}
          onRequestClose={() => {
            setState(prevState => ({ ...prevState, videoVisible: false }));
          }}
        >
          <WebView
            javaScriptEnabled={true}
            allowsFullscreenVideo
            style={{ flex: 1, borderColor: Colors.red, borderWidth: 1 }}
            source={{
              uri: event.recordingLink,
            }}
          />
        </Modal>
      )}

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
          setState(prevState => ({ ...prevState, showAlert: false }));
        }}
      />

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
          setState(prevState => ({
            ...prevState,
            showPaymentAlert: false,
            paymentAlertMessage: "Your Payment is Successful!",
            paymentAlertTitle: "Success",
          }));
        }}
      />

      <AwesomeAlert
        show={state.showBookAlert}
        showProgress={false}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        customView={
          <View style={{
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text style={{
              fontSize: WIDTH * 0.058,
              marginVertical: HEIGHT * 0.015,
              fontWeight: "bold",
              textAlign: "center",
            }}>
              Your session is starting in:
            </Text>
            <CountdownTimer targetTime={event.startTime} />
            <Text style={{
              fontSize: WIDTH * 0.04,
              textAlign: "center",
              marginVertical: HEIGHT * 0.015,
            }}>
              Are you sure you want to cancel your booking?
            </Text>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: WIDTH * 0.5,
            }}>
              <Button
                title="Yes"
                buttonStyle={{
                  backgroundColor: Colors.errorButton,
                  width: WIDTH * 0.2,
                }}
                onPress={() => {
                  setState(prevState => ({ ...prevState, showBookAlert: false }));
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
                  setState(prevState => ({ ...prevState, showBookAlert: false }));
                }}
              />
            </View>
          </View>
        }
      />

      <AwesomeAlert
        show={state.belowAgePopUp}
        showProgress={false}
        message="GoHappy Club is an initiative exclusively for aged 50 years and above. You can not join this session but share it with your family members."
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Share"
        confirmButtonColor={Colors.primary}
        onConfirmPressed={() => {
          handleBelowAge(event, "https://www.gohappyclub.in/session_details/" + event.id);
          setState(prevState => ({ ...prevState, belowAgePopUp: false }));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    cover: {
      width: "100%",
      height: "100%",
      borderRadius: 50,
    },
  });
  
  const contentHtmlStyles = {
    table: {
      borderCollapse: "collapse",
      width: "100%",
      fontSize: 10,
    },
    td: {
      borderWidth: 1,
      borderStyle: "solid",
    },
  };

export default SessionDetails;