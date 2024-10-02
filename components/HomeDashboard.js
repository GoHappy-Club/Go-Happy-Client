import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Linking,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Share,
  Alert,
} from "react-native";
import { Badge, Button, Text } from "react-native-elements";
import AwesomeAlert from "react-native-awesome-alerts";
import { parseISO, format, getTime, fromUnixTime } from "date-fns";
import { Avatar, Card as Cd, Title } from "react-native-paper";
import { Dimensions } from "react-native";
import CalendarDays from "react-native-calendar-slider-carousel";
import { MaterialIndicator } from "react-native-indicators";

import { useSelector, useDispatch } from "react-redux";
import { setZoomToken } from "../redux/actions/counts.js";
import { setSessionAttended } from "../services/events/EventService";

import phonepe_payments from "./PhonePe/Payments.js";
import toUnicodeVariant from "./toUnicodeVariant.js";
import tambola from "tambola";
import { Colors } from "../assets/colors/color.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateZoomSignature } from "../services/zoom/zoomTokenGenerator.js";
import { useZoom } from "zoom-msdk-rn";

const { width: screenWidth } = Dimensions.get("window");

const HomeDashboard = ({
  navigation,
  loadEvents,
  events,
  childLoader,
  bookEvent,
}) => {
  const profile = useSelector((state) => state.profile.profile);
  const dispatch = useDispatch();
  const zoom = useZoom();

  const [state, setState] = useState({
    loader: false,
    selectedDate: new Date().toDateString(),
    email: null,
    bookingLoader: false,
    selectedDateRaw: new Date().setHours(0, 0, 0, 0),
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
  });

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("email");
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      if (value !== null) {
        setState((prevState) => ({ ...prevState, email: value }));
      }
      if (phoneNumber !== null) {
        setState((prevState) => ({ ...prevState, phoneNumber }));
      }
    } catch (error) {
      // Error retrieving data
    }
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
        meetingNumber: extractMeetingNumber(state?.itemClicked?.meetingLink),
        password: "12345",
      });
    } catch (e) {
      console.log(e);
      Alert.alert('' + e);
    }
  };

  const phonePeWrapper = async (type, item) => {
    const callback = (id) => {
      setState((prevState) => ({ ...prevState, success: true }));

      if (id === "") {
        navigation.navigate("GoHappy Club");
      } else {
        updateEventBook(item);
        setState((prevState) => ({ ...prevState, showPaymentAlert: true }));
      }
    };

    const errorHandler = () => {
      setState((prevState) => ({
        ...prevState,
        paymentAlertMessage: phonepe_payments.PaymentError(),
        paymentAlertTitle: "Oops!",
        showPaymentAlert: true,
      }));
    };

    if (type === "share") {
      const tambolaTicket = tambola.generateTicket();
      const link = await phonepe_payments.phonePeShare(
        profile.phoneNumber,
        item.cost,
        errorHandler,
        "workshop",
        item.id,
        tambolaTicket
      );

      const message = `Hello from the GoHappy Club Family,
${toUnicodeVariant(
  profile.name,
  "italic"
)} is requesting a payment of ₹${toUnicodeVariant(
        String(item.cost),
        "bold"
      )} for ${toUnicodeVariant(item.eventName, "bold")}.
Please make the payment using the link below:
${link}
${toUnicodeVariant("Note:", "bold")} The link will expire in 20 minutes.
`;

      try {
        await Share.share({ message });
        setState((prevState) => ({ ...prevState, clickPopup: false }));
      } catch (error) {
        console.log("error in sharing", error);
      }
    } else {
      phonepe_payments.phonePe(
        profile.phoneNumber,
        item.cost,
        callback,
        errorHandler,
        "workshop"
      );
    }
  };

  const handleClickBook = useCallback((item) => {
    setState((prevState) => ({
      ...prevState,
      itemToBuy: item,
      clickPopup: true,
    }));
  }, []);

  const changeSelectedDate = (date) => {
    const parsedSelect = parseISO(date);
    const select = format(parsedSelect, "EEE MMM dd yyyy");
    const tempDate = getTime(date);

    setState((prevState) => ({
      ...prevState,
      selectedDate: select,
      selectedDateRaw: tempDate,
      events: [],
    }));

    loadEvents(tempDate);
  };

  const trimContent = (text, cut) => {
    if (text.length < cut) {
      return text;
    }
    return text.substring(0, cut) + "...";
  };

  const isOngoingEvent = (item) => {
    return item.startTime - 600000 <= new Date().getTime();
  };

  const checkIsParticipantInSameEvent = (item) => {
    if (item.sameDayEventId === null) {
      return false;
    }
    return events.some(
      (event) =>
        event.sameDayEventId === item.sameDayEventId &&
        event.participantList.includes(profile.phoneNumber)
    );
  };

  const handleBelowAge = (item, url) => {
    const link = url;
    const shareMessage =
      `👋 Hi! A new session is starting at GoHappy Club, which is very useful and interesting for seniors. \n\n` +
      `📚 The name of the session is *${toUnicodeVariant(
        item.eventName,
        "bold italic"
      )}*.\n\n` +
      `I think you will definitely like it! 😊 \n\n` +
      `👉 Here is the link to the session: \n${link}.\n\n` +
      `💬 Join in and let me know how you liked it! 👍`;

    Share.share({ message: shareMessage })
      .then((result) => {})
      .catch((errorMsg) => {});
  };

  const updateEventBook = (item) => {
    setState((prevState) => ({
      ...prevState,
      bookingLoader: true,
      itemClicked: item,
    }));
    if (getTitle(item) === "Share") {
      setState((prevState) => ({ ...prevState, belowAgePopUp: true }));
      return;
    }
    if (getTitle(item) === "Join") {
      setSessionAttended(profile.phoneNumber);
      // Linking.openURL(item.meetingLink);
      joinMeeting();
      return;
    }
    if (checkIsParticipantInSameEvent(item)) {
      setState((prevState) => ({ ...prevState, showAlert: true }));
      return;
    }
    item.loadingButton = true;
    bookEvent(item, profile.phoneNumber, state.selectedDateRaw);
  };

  const loadCaller = () => {
    loadEvents(state.selectedDateRaw);
  };

  const sorry = () => (
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
      Check tomorrow's sessions 😁
    </Text>
  );

  const loadDate = (item) => {
    const dt = fromUnixTime(item.startTime / 1000);
    return format(dt, "MMM d, h:mm aa");
  };

  const getTitle = (item) => {
    if (profile.age != null && profile.age < 50) {
      return "Share";
    }
    const isOngoing = isOngoingEvent(item);
    if (item.participantList == null) {
      return "Book";
    }
    const isParticipant = item.participantList.includes(profile.phoneNumber);

    if (isOngoing && isParticipant) {
      return "Join";
    } else if (isParticipant) {
      return "Booked";
    } else if (item.seatsLeft == 0) {
      return "Seats Full";
    } else {
      return "Book";
    }
  };

  const isDisabled = (item) => {
    const isOngoing = isOngoingEvent(item);
    if (item.participantList == null) {
      return false;
    }

    const isParticipant = item.participantList.includes(profile.phoneNumber);

    if (isParticipant && !isOngoing) {
      return true;
    } else if (isParticipant) {
      return false;
    } else if (item.seatsLeft == 0) {
      return true;
    } else {
      return false;
    }
  };

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
          navigation.navigate("Session Details", {
            phoneNumber: profile.phoneNumber,
            profile: profile,
            deepId: item.id,
            onGoBack: () => loadCaller(),
            alreadyBookedSameDayEvent: checkIsParticipantInSameEvent(item),
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
                {loadDate(item)} |
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
                  {"\u20B9"}
                  {item.cost}
                </Text>
              )}
            </View>
          </View>
          <Title style={{ color: Colors.white, fontSize: 20, padding: 4 }}>
            {trimContent(item.eventName, 30)}
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
                {trimContent(item.expertName, 17)}
              </Title>
            </View>
            <Button
              disabled={isDisabled(item)}
              title={getTitle(item)}
              onPress={
                item.costType == "paid" && getTitle(item) == "Book"
                  ? () => handleClickBook(item)
                  : () => updateEventBook(item)
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
    <View style={{ flex: 1, backgroundColor: Colors.grey.f0 }}>
      <CalendarDays
        numberOfDays={15}
        daysInView={3}
        paginate={true}
        onDateSelect={(date) => changeSelectedDate(date)}
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
        {state.selectedDate}
      </Text>
      {childLoader == true && <MaterialIndicator color={Colors.primary} />}
      {childLoader == false &&
        events.filter((item) => item.endTime > Date.now()).length > 0 && (
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              contentContainerStyle={{ flexGrow: 1 }}
              data={events.filter((item) => item.endTime > Date.now())}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </SafeAreaView>
        )}
      {events.filter((item) => item.endTime > Date.now()).length == 0 &&
        childLoader == false &&
        sorry()}
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
          setState((prevState) => ({ ...prevState, showAlert: false }));
        }}
      />
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
          phonePeWrapper("self", state.itemToBuy);
          setState((prev) => ({ ...prev, clickPopup: false }));
        }}
        confirmText="Share"
        showCancelButton={true}
        onConfirmPressed={() => {
          phonePeWrapper("share", state.itemToBuy);
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
          setState((prev) => ({
            ...prev,
            showPaymentAlert: false,
            paymentAlertMessage: "Your Payment is Successful!",
            paymentAlertTitle: "Success",
          }));
        }}
      />
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
            state.itemClicked,
            "https://www.gohappyclub.in/session_details/" + state.itemClicked.id
          );
          setState((prev) => ({ ...prev, belowAgePopUp: false }));
        }}
      />
    </View>
  );
};

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
});

export default HomeDashboard;
