import { format, fromUnixTime, getTime, parseISO } from "date-fns";
import { Clock, Share2, Star } from "lucide-react-native";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Share,
  TouchableOpacity,
  View,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import { Button, Text } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { MaterialIndicator } from "react-native-indicators";
import { useSelector } from "react-redux";

import { Colors } from "../../assets/colors/color.js";
import CustomCalendarStrip from "../../commonComponents/CalendarStrip.js";
import { formatNumberWithSuffix } from "../../commonComponents/helpers.js";
import { wp } from "../../helpers/common.js";
import Coin from "../../images/coins.png";
import toUnicodeVariant from "../toUnicodeVariant.js";
import SearchBar from "./SearchBar.js";

const HomeDashboard = ({
  events,
  ratings,
  childLoader,
  loadEvents,
  navigation,
}) => {
  const profile = useSelector((state) => state.profile.profile);

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
      const value = await globalThis.AsyncStorage.getItem("email");
      const phoneNumber = await globalThis.AsyncStorage.getItem("phoneNumber");
      if (value !== null) {
        setState((prevState) => ({ ...prevState, email: value }));
      }
      if (phoneNumber !== null) {
        setState((prevState) => ({ ...prevState, phoneNumber }));
      }
    } catch (error) {
      // Error retrieving data
      console.log("Error retrieving data", error);
    }
  };

  const changeSelectedDate = (date) => {
    const parsedSelect = parseISO(date);
    parsedSelect.setHours(0, 0, 0, 0);
    const select = format(parsedSelect, "EEE MMM dd yyyy");
    const tempDate = getTime(parsedSelect);
    parsedSelect.setHours(23, 59, 0, 0);
    const midnightDate = getTime(parsedSelect);

    setState((prevState) => ({
      ...prevState,
      selectedDate: select,
      selectedDateRaw: tempDate,
      events: [],
    }));

    loadEvents(tempDate, midnightDate);
  };

  const trimContent = (text, cut) => {
    if (text.length < cut) {
      return text;
    }
    return text.substring(0, cut) + "...";
  };

  const isOngoingEvent = (item) => {
    globalThis
      .crashlytics()
      .log(
        JSON.stringify(item.startTime) + JSON.stringify(new Date().getTime()),
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
        event.participantList.includes(profile.phoneNumber),
    );
  };

  const handleBelowAge = (item, url) => {
    const link = url;
    const shareMessage =
      `👋 Hi! A new session is starting at GoHappy Club, which is very useful and interesting for seniors. \n\n` +
      `📚 The name of the session is *${toUnicodeVariant(
        item.eventName,
        "bold italic",
      )}*.\n\n` +
      `I think you will definitely like it! 😊 \n\n` +
      `👉 Here is the link to the session: \n${link}.\n\n` +
      `💬 Join in and let me know how you liked it! 👍`;

    Share.share({ message: shareMessage })
      .then(() => {})
      .catch(() => {});
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
      Check tomorrow&apos;s sessions 😁
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
      if (item?.eventName?.toLowerCase().includes("tambola")) {
        return "View Ticket";
      }
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
        "https://www.gohappyclub.in/session_details/" + item.id,
      );
      return;
    }
    const sessionShareMessage =
      item.shareMessage != null
        ? item.shareMessage
        : await createShareMessage(
            item,
            "https://www.gohappyclub.in/session_details/" + item.id,
          );
    Share.share({
      message: sessionShareMessage,
    })
      .then(() => {})
      .catch(() => {});
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
        backgroundColor: Colors.background,
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
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: wp(5.5),
              width: "75%",
            }}
          >
            {trimContent(item.eventName, 30)}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
            }}
          >
            {item.costType == "paid" &&
              item?.type?.toLowerCase() == "workshop" && (
                <Text
                  style={{
                    fontFamily: "Montserrat-SemiBold",
                    color: Colors.grey.grey,
                    fontSize: wp(5),
                  }}
                >
                  ₹
                </Text>
              )}
            <Text
              style={{
                fontFamily: "Montserrat-SemiBold",
                color: Colors.grey.grey,
                fontSize: wp(5),
              }}
            >
              {item.costType == "paid"
                ? formatNumberWithSuffix(item.cost)
                : "FREE"}
            </Text>
            {item.costType == "paid" &&
              item?.type?.toLowerCase() != "workshop" && (
                <FastImage
                  source={Coin}
                  style={{
                    width: wp(6),
                    aspectRatio: 1,
                  }}
                />
              )}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Clock size={14} color={Colors.grey.grey} />
          <Text
            style={{
              fontFamily: "Montserrat-Regular",
              color: Colors.grey.grey,
              fontSize: wp(3.5),
            }}
          >
            {loadDate(item).split(", ")[1]}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "Montserrat-Regular",
            color: Colors.grey.grey,
            fontSize: wp(3.5),
          }}
        >
          Seats Left : {item.seatsLeft}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <FastImage
            source={{ uri: item.expertImage }}
            style={{
              width: wp(6),
              aspectRatio: 1,
              borderRadius: wp(50),
              borderWidth: 0.3,
              borderColor: Colors.black,
            }}
            resizeMode="cover"
          />
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              textAlign: "center",
              fontSize: wp(3),
            }}
          >
            {item.expertName}
          </Text>
        </View>
      </View>
      <Button
        disabled={isDisabled(item)}
        title={getTitle(item)}
        onPress={() => {
          navigation.navigate("Session Details", {
            phoneNumber: profile.phoneNumber,
            profile: profile,
            deepId: item.id,
            onGoBack: () => loadCaller(),
            alreadyBookedSameDayEvent: checkIsParticipantInSameEvent(item),
          });
        }}
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
          color: Colors.primaryText,
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
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <CustomCalendarStrip
          selectedDate={state.selectedDateRaw}
          changeSelectedDate={(date) => {
            changeSelectedDate(date);
          }}
        />

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
                  state.itemClicked.id,
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

HomeDashboard.propTypes = {
  events: PropTypes.array.isRequired,
  profile: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  loadCaller: PropTypes.func.isRequired,
  checkIsParticipantInSameEvent: PropTypes.func.isRequired,
  ratings: PropTypes.array.isRequired,
  childLoader: PropTypes.bool.isRequired,
  loadEvents: PropTypes.func.isRequired,
};

export default HomeDashboard;
