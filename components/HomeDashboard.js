import React, { Component, useEffect, useState } from "react";
import {
  FlatList,
  Linking,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Share,
} from "react-native";
import { Badge, Button, Text } from "react-native-elements";
import AwesomeAlert from "react-native-awesome-alerts";
import {
  parseISO,
  format,
  getTime,
  fromUnixTime,
  parse,
  addHours,
} from "date-fns";
import { Dimensions } from "react-native";
import { MaterialIndicator } from "react-native-indicators";

import { useDispatch, useSelector } from "react-redux";
import { setSessionAttended } from "../services/events/EventService";

import toUnicodeVariant from "./toUnicodeVariant.js";
import { Colors } from "../assets/colors/color.js";
import SearchBar from "./SearchBar.js";
import { hp, wp } from "../helpers/common.js";
import { storeCompletedSession } from "../services/Startup.js";
import { Share2, Star } from "lucide-react-native";
import FastImage from "react-native-fast-image";
const { width: screenWidth } = Dimensions.get("window");
import { useZoom } from "../helpers/zoomUtils.js";
import CalendarStrip from "react-native-calendar-strip";
import dayjs from "dayjs";
import Sound from "react-native-sound";
const HomeDashboard = ({
  events,
  ratings,
  childLoader,
  bookEvent,
  loadEvents,
  navigation,
}) => {
  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state.membership.membership);

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
    nonMemberPopUp: false,
    lowCoinsPopUp: false,
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

  const extractMeetingNumber = (url) => {
    const regex = /j\/(\d+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  };

  const joinMeeting = async (item) => {
    try {
      await zoom.joinMeeting({
        userName: profile.name + String(profile.phoneNumber),
        meetingNumber: extractMeetingNumber(item?.meetingLink),
        password: "12345",
      });
    } catch (e) {
      console.log("Error in join", e);
      Alert.alert("Error in join", "" + e);
    }
  };

  const handleClickBook = (item) => {
    if (!isBookingAllowed(item)) return;
    // setState({ itemToBuy: item }, () => {
    //   setState({ clickPopup: true });
    // });
    updateEventBook(item);
  };

  const isBookingAllowed = (item) => {
    if (membership.freeTrialActive == true) return true;
    if (membership && membership?.membershipType == "Free") {
      // setState({ nonMemberPopUp: true });
      navigation.navigate("SubscriptionPlans");
      return false;
    } else if (membership && membership?.coins < item.cost) {
      setState({ lowCoinsPopUp: true });
      return false;
    }

    return true;
  };

  const changeSelectedDate = (date) => {
    const parsedSelect = parseISO(date);
    parsedSelect.setHours(0, 0, 0, 0);
    const select = format(parsedSelect, "EEE MMM dd yyyy");
    const tempDate = getTime(parsedSelect);

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
    crashlytics().log(
      JSON.stringify(item.startTime) + JSON.stringify(new Date().getTime())
    );
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

  const updateEventBook = async (item) => {
    setState((prevState) => ({
      ...prevState,
      bookingLoader: true,
      itemClicked: item,
    }));
    if (getTitle(item) == "Share") {
      setState((prevState) => ({ ...prevState, belowAgePopUp: true }));
      return;
    }
    if (getTitle(item) == "Join") {
      await storeCompletedSession(
        item.id,
        item.eventName,
        item.coverImage,
        item.subCategory,
        profile.phoneNumber
      );
      setSessionAttended(profile.phoneNumber);
      // await Linking.openURL(item.meetingLink);
      joinMeeting(item);
      await giveRewards(item);
      return;
    }
    if (checkIsParticipantInSameEvent(item)) {
      setState((prevState) => ({ ...prevState, showAlert: true }));
      return;
    }
    item.loadingButton = true;
    bookEvent(item, profile.phoneNumber, state.selectedDateRaw, playSound);
  };

  const giveRewards = async (item) => {
    try {
      const response = await axios.post(`${SERVER_URL}/event/giveReward`, {
        phone: profile.phoneNumber,
        eventId: item.id,
      });
    } catch (error) {
      console.log("Error in giveRewards ==>", error);
    }
  };

  const loadCaller = () => {
    navigation.navigate("HomeScreen");
    loadEvents(state.selectedDateRaw);
  };

  const sorry = () => (
    <Text
      style={{
        fontSize: 18,
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

  const playSound = () => {
    const sound = new Sound("booked.mp3", Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log("failed to load the sound", error);
        return;
      }
      sound.play((success) => {
        if (!success) {
          console.log("playback failed due to audio decoding errors");
        }
      });
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      delayPressIn={150}
      style={{
        flex: 1,
        flexDirection: "column",
        margin: 1,
        width: wp(88),
        backgroundColor: Colors.white,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        borderRadius: wp(3),
        // elevation: 1,
      }}
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
      <View
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        <FastImage
          source={{ uri: item.coverImage }}
          style={{
            width: "100%",
            height: wp(55),
            borderRadius: wp(3),
            resizeMode: "cover",
            // elevation:5
          }}
          resizeMode="cover"
        />
        <View
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            backgroundColor: Colors.grey.f0,
            padding: 5,
            borderRadius: wp(10),
            borderColor: "white",
            borderWidth: 1,
            paddingHorizontal: wp(3),
            backdropFilter: "blur(12px)",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
            flexDirection: "row",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FastImage
            source={{ uri: item.expertImage }}
            style={{
              width: wp(6),
              aspectRatio: 1,
              borderRadius: wp(50),
            }}
            resizeMode={FastImage.resizeMode.center}
          />
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              textAlign: "center",
              fontSize: 12,
            }}
          >
            {item.expertName}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: Colors.grey.f0,
            padding: 5,
            borderRadius: wp(10),
            borderColor: "white",
            borderWidth: 1,
            paddingHorizontal: wp(3),
            backdropFilter: "blur(12px)",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              textAlign: "center",
            }}
          >
            {item.category}
          </Text>
        </View>
        <Share2
          color={"white"}
          size={28}
          style={{
            position: "absolute",
            right: 10,
            top: 10,
          }}
          fill={"white"}
          onPress={() => shareMessage(item)}
        />
      </View>
      <View
        style={{
          paddingHorizontal: 5,
          gap: 2,
          paddingBottom: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
            width: "100%",
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: wp(5.5),
            }}
          >
            {trimContent(item.eventName, 30)}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Star size={16} color={"gold"} fill={"gold"} />
            <Text
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: wp(4),
              }}
            >
              {ratings && ratings[item.subCategory] != undefined
                ? ratings[item.subCategory]?.toFixed(1) + "/5"
                : "-/5"}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: "Montserrat-Regular",
            color: Colors.grey.grey,
            fontSize: wp(3.5),
          }}
        >
          {loadDate(item)}
        </Text>
        <Text
          style={{
            fontFamily: "Montserrat-Regular",
            color: Colors.grey.grey,
            fontSize: wp(3.5),
          }}
        >
          Seats Left : {item.seatsLeft}
        </Text>

        <Text
          style={{
            fontFamily: "Montserrat-Regular",
            color: Colors.grey.grey,
            fontSize: wp(3.5),
          }}
        >
          {item.costType == "paid" ? item.cost : "FREE"}
          {item.costType == "paid" && (
            <FastImage
              source={require("../images/GoCoins.png")}
              style={{
                height: 15,
                width: 15,
              }}
            />
          )}
        </Text>
      </View>
      <Button
        disabled={isDisabled(item)}
        title={getTitle(item)}
        onPress={
          item.costType == "paid" && getTitle(item) == "Book"
            ? handleClickBook.bind(this, item)
            : updateEventBook.bind(this, item)
        }
        loading={item.loadingButton}
        loadingProps={{ size: "small", color: Colors.black }}
        buttonStyle={{
          backgroundColor: Colors.primary,
          fontSize: wp(4),
        }}
        containerStyle={{
          position: "absolute",
          right: 10,
          bottom: 10,
        }}
        titleStyle={{
          color: Colors.white,
          fontSize: wp(3.5),
          fontWeight: "bold",
          letterSpacing: 1,
        }}
        touchSoundDisabled={true}
      />
    </TouchableOpacity>
  );

  return (
    <>
      <SearchBar
        loadCaller={loadCaller}
        checkIsParticipantInSameEvent={checkIsParticipantInSameEvent}
      />
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <CalendarStrip
          calendarAnimation={{ type: "sequence", duration: 10 }}
          daySelectionAnimation={{
            type: "background",
            duration: 200,
            borderWidth: 2,
            borderHighlightColor: "#FF5733",
          }}
          minDate={new Date()}
          maxDate={dayjs().add(8, "days").toDate()}
          style={calendarStyles.calendarStrip}
          calendarHeaderStyle={calendarStyles.headerStyle}
          selectedDate={new Date()}
          calendarColor={"#fff"}
          dateNumberStyle={calendarStyles.dateNumberStyle}
          dateNameStyle={calendarStyles.dateNameStyle}
          highlightDateNumberStyle={calendarStyles.highlightDateNumberStyle}
          disabledDateNumberStyle={calendarStyles.disabledDateNumberStyle}
          showDayName={false}
          dayContainerStyle={{
            borderRadius: 0,
            marginHorizontal: 2,
          }}
          numDaysInWeek={7}
          dayComponent={({ date, selected, onDateSelected }) => (
            <TouchableOpacity
              onPress={() => onDateSelected && onDateSelected(date)}
              style={{
                alignItems: "center",
                padding: 5,
                backgroundColor: selected ? "#FF5733" : "transparent",
                borderRadius: 5,
              }}
            >
              <Text
                style={{ fontSize: 12, color: selected ? "white" : "black" }}
              >
                {date.format("MMM")}
              </Text>
              <Text
                style={{ fontSize: 16, color: selected ? "white" : "black" }}
              >
                {date.format("DD")}
              </Text>
            </TouchableOpacity>
          )}
          onDateSelected={(date) => changeSelectedDate(date.toISOString())}
        />
        {/* <DatePicker /> */}

        <Text
          style={{
            fontSize: 18,
            marginLeft: 30,
            marginBottom: 15,
            color: Colors.greyishText,
          }}
        >
          {state.selectedDate}
        </Text>
        {childLoader == true && <MaterialIndicator color={Colors.primary} />}
        {childLoader == false &&
          events.filter((item) => item.endTime > Date.now()).length > 0 && (
            <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
              <FlatList
                contentContainerStyle={{ flexGrow: 1 }}
                data={events.filter((item) => item.endTime > Date.now())}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={
                  <View
                    style={{
                      marginBottom: 10,
                    }}
                  />
                }
              />
            </SafeAreaView>
          )}
        {events.filter((item) => item.endTime > Date.now()).length == 0 &&
          childLoader == false &&
          sorry()}
        {/* {wentBack ? 'do something it went back!' : 'it didnt go back'} */}
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
              setState({ showAlert: false });
            }}
            onDismiss={() => setState({ showAlert: false })}
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
              setState({
                showPaymentAlert: false,
                paymentAlertMessage: "Your Payment is Successful!",
                paymentAlertTitle: "Success",
              });
            }}
            onDismiss={() => setState({ showPaymentAlert: false })}
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
                state.itemClicked,
                "https://www.gohappyclub.in/session_details/" +
                  state.itemClicked.id
              );
              setState({ belowAgePopUp: false });
            }}
            onDismiss={() => setState({ belowAgePopUp: false })}
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
            confirmText="Join Now"
            confirmButtonColor={Colors.primary}
            onConfirmPressed={() => {
              navigation.navigate("SubscriptionPlans");
            }}
            onDismiss={() => setState({ nonMemberPopUp: false })}
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
            confirmText="Top up Now"
            confirmButtonColor={Colors.primary}
            onConfirmPressed={() => {
              navigation.navigate("TopUpScreen");
            }}
            onDismiss={() => setState({ lowCoinsPopUp: false })}
          />
        )}
      </View>
    </>
  );
};

const calendarStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  calendarStrip: {
    height: hp(10),
  },
  headerStyle: {
    color: "#333",
    fontSize: 18,
    display: "none",
  },
  dateNumberStyle: {
    color: "#333",
    fontSize: 16,
    backgroundColor: "red",
    padding: 5,
    width: wp(10),
    height: wp(10),
  },
  dateNameStyle: {
    color: "#666",
    fontSize: 14,
  },
  highlightDateNumberStyle: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "red",
    padding: 10,
  },
  disabledDateNameStyle: {
    color: "#CCC",
  },
  disabledDateNumberStyle: {
    color: "#CCC",
  },
  iconContainer: {
    flex: 0.1,
  },
});

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

export default HomeDashboard;
