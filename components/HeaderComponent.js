import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faWallet, faCrown } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  Pressable,
  Animated,
  Easing,
  AppState,
  SafeAreaView,
} from "react-native";
import { Colors } from "../assets/colors/color";
import { useDispatch, useSelector } from "react-redux";
import GradientText from "../commonComponents/GradientText";
import { useNavigation } from "@react-navigation/native";
import BottomSheet from "./CustomBottomSheet/BottomSheet";
import SessionRatingSheet from "./CustomBottomSheet/RatingSheet";
import {
  activateFreeTrial,
  checkPendingFeedback,
  deactivateFreeTrial,
  getTodaysFestival,
  submitRating,
  checkFreeTrialExpired,
} from "../services/Startup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setMembership } from "../redux/actions/counts";
import dayjs from "dayjs";
import quotes from "../constants/quotes.json";
import {
  ScheduledNotifcation,
  scheduleMedicineReminders,
  scheduleWaterReminders,
} from "../services/LocalPushController";

const width = Dimensions.get("window").width;

const rotateAnim = new Animated.Value(0);

const Header = () => {
  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state?.membership?.membership);
  const dispatch = useDispatch();

  const [modalType, setModalType] = useState("");
  const [showRating, setShowRating] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [freeTrialActivated, setFreeTrialActivated] = useState(false);

  const modalRef = useRef();
  const ratingModalRef = useRef();
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const getRandomQuote = async () => {
      const today = new Date().toISOString().split("T")[0];

      const storedQuoteData = await AsyncStorage.getItem("dailyQuote");
      if (storedQuoteData) {
        const parsedData = JSON.parse(storedQuoteData);
        if (parsedData.date === today) {
          return parsedData;
        }
      }
      const randomIndex = Math.floor(Math.random() * quotes.quotes.length);
      const randomQuote = quotes.quotes[randomIndex];

      const quoteData = {
        date: today,
        quote: randomQuote,
      };

      await AsyncStorage.setItem("dailyQuote", JSON.stringify(quoteData));
      const notificationTime = dayjs().add(1, "day").toDate();

      ScheduledNotifcation(
        "Your Daily Motivation",
        randomQuote.english,
        notificationTime
      );
      return quoteData;
    };
    getRandomQuote();
    scheduleWaterReminders();
    scheduleMedicineReminders();
  }, []);

  useEffect(() => {
    const getFestival = async () => {
      // get today's festival if any
      const alreadyCheckedFestival = await AsyncStorage.getItem(
        "alreadyCheckedFestival"
      );
      const currDate = new Date().toISOString().split("T")[0].split("-")[2];
      if (
        alreadyCheckedFestival == null ||
        Number(alreadyCheckedFestival) != currDate
      ) {
        const festival = await getTodaysFestival();
        const showTour = await AsyncStorage.getItem("showTour");
        if (
          ((showTour == null || showTour == "false") &&
            festival != undefined) ||
          festival != null
        ) {
          navigation.navigate("FestiveWish", {
            asset: festival.asset,
            title: festival.name,
            message: festival.message,
          });
        }
        AsyncStorage.setItem("alreadyCheckedFestival", String(currDate));
      }
    };
    getFestival();
  }, []);

  useEffect(() => {
    checkPendingFeedback(setShowRating, setCurrentSession);

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        checkPendingFeedback(setShowRating, setCurrentSession);
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    const enableModal = async () => {
      const showTour = await AsyncStorage.getItem("showTour");
      if (showTour == null || showTour == "false") {
        setModalType("FreeTrial");
      }
    };
    if (
      membership.membershipType == "Free" &&
      membership?.freeTrialUsed == false
    ) {
      enableModal();
    } else if (
      membership.membershipType == "Silver" &&
      membership?.freeTrialUsed == true &&
      checkFreeTrialExpired(membership)
    ) {
      deactivateFreeTrial();
      setModalType("FreeTrialExpired");
    }
  }, [membership]);

  // TODO : free trial modal
  useEffect(() => {
    if (modalType == "FreeTrial" || modalType == "FreeTrialExpired")
      openGeneralModal(modalRef);
  }, [modalType]);

  // TODO : rating modal
  useEffect(() => {
    checkPendingFeedback(setShowRating, setCurrentSession);
  }, []);

  // TODO : open the rating modal
  useEffect(() => {
    if (showRating == true) {
      ratingModalRef.current?.present();
    }
  }, [showRating, currentSession, ratingModalRef.current]);

  const openGeneralModal = () => {
    modalRef.current?.present();
  };
  const closeGeneralModal = () => {
    modalRef.current?.dismiss();
  };

  const navigation = useNavigation();

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleNavigate = () => {
    navigation.navigate("MyProfile");
  };

  const trimContent = (content) => {
    if (content.length > 7) {
      return content.substring(0, 7) + "...";
    }
    return content;
  };

  function formatNumberWithSuffix(number) {
    if (number >= 1e7) {
      return (number / 1e7)?.toFixed(1) + "Cr";
    } else if (number >= 1e5) {
      return (number / 1e5)?.toFixed(1) + "L";
    } else if (number >= 1e3) {
      return (number / 1e3)?.toFixed(1) + "K";
    } else {
      return number?.toString();
    }
  }

  const setNewMembership = ({
    membershipType,
    id,
    membershipStartDate,
    membershipEndDate,
    coins,
    freeTrialActive,
  }) => {
    const newMembership = {
      membershipType: membershipType,
      id: id,
      membershipStartDate: membershipStartDate,
      membershipEndDate: membershipEndDate,
      coins: coins,
      freeTrialActive: freeTrialActive,
    };
    dispatch(setMembership({ ...newMembership }));
  };

  const updateUser = ({
    membershipType,
    id,
    membershipStartDate,
    membershipEndDate,
    coins,
    freeTrialActive,
  }) => {
    //store membership in AsyncStorage
    AsyncStorage.setItem("membershipType", membershipType);
    AsyncStorage.setItem("membershipId", id);
    AsyncStorage.setItem("membershipStartDate", membershipStartDate);
    AsyncStorage.setItem("membershipEndDate", membershipEndDate);
    AsyncStorage.setItem("coins", coins.toString());
    AsyncStorage.setItem("freeTrialActive", freeTrialActive.toString());
    //set membership in redux
    setNewMembership({
      membershipType: membershipType,
      id: id,
      membershipStartDate: membershipStartDate,
      membershipEndDate: membershipEndDate,
      coins: coins,
      freeTrialActive: freeTrialActive,
    });
  };

  const showRedDot = () => {
    if (
      profile.email == "" ||
      profile.email == null ||
      profile.email == undefined
    ) {
      return true;
    } else if (
      profile.phoneNumber == "" ||
      profile.phoneNumber == null ||
      profile.phoneNumber == undefined
    ) {
      return true;
    } else if (
      profile.profileImage == "" ||
      profile.profileImage == null ||
      profile.profileImage == undefined
    ) {
      return true;
    } else if (
      profile.age == "" ||
      profile.age == null ||
      profile.age == undefined
    ) {
      return true;
    } else if (
      profile.emergencyContact == "" ||
      profile.emergencyContact == null ||
      profile.emergencyContact == undefined
    ) {
      return true;
    } else if (
      profile.city == "" ||
      profile.city == null ||
      profile.city == undefined
    ) {
      return true;
    } else if (
      profile.dob == "" ||
      profile.dob == null ||
      profile.dob == undefined
    ) {
      return true;
    }
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.bottomNavigation}
      />
      <BottomSheet
        closeModal={() => closeGeneralModal()}
        modalRef={modalRef}
        type={modalType}
        freeTrialActivated={freeTrialActivated}
        cta={async () => {
          const membership = await activateFreeTrial(profile);
          updateUser({ ...membership, freeTrialActive: true });
          setFreeTrialActivated(true);
          const timeout = setTimeout(() => {
            closeGeneralModal();
            setFreeTrialActivated(false);
            clearTimeout(timeout);
          }, 4200);
        }}
      />
      <SessionRatingSheet
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        reason={reason}
        setReason={setReason}
        modalRef={ratingModalRef}
        submitted={submitted}
        setSubmitted={setSubmitted}
        closeModal={() => {
          submitRating(
            currentSession,
            setCurrentSession,
            setShowRating,
            0,
            false
          );
          ratingModalRef.current?.dismiss();
        }}
        currentSession={currentSession}
        submitRating={() => {
          submitRating(
            currentSession,
            setCurrentSession,
            setShowRating,
            selectedRating,
            true,
            profile.phoneNumber,
            reason,
            setSubmitted
          );
        }}
      />
      <View style={styles.header}>
        <Pressable style={styles.userInfo} onPress={handleNavigate}>
          <Image
            source={{
              uri: profile.profileImage,
              height: 40,
              width: 40,
            }}
            resizeMethod="resize"
            resizeMode="cover"
            style={styles.profileImage}
          />
          {showRedDot() && (
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: Colors.red,
                borderRadius: 10,
                width: 10,
                height: 10,
                zIndex: 1,
                borderWidth: 1,
                borderColor: Colors.background,
              }}
            />
          )}
        </Pressable>
        <View style={styles.rightWrapper}>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => navigation.navigate("SubscriptionPlans")}
          >
            <FontAwesomeIcon icon={faCrown} color="#FBC65F" />
            {/* <GradientText
              text="Upgrade"
              style={styles.upgradeText}
              colors={Colors.headerLinearGradient}
            /> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.credits}
            onPress={() => navigation.navigate("WalletScreen")}
          >
            <Animated.Image
              source={require("../images/GoCoins.png")}
              style={{
                height: 25,
                width: 25,
                transform: [{ rotateY: spin }],
              }}
            />
            <Text
              style={[
                styles.creditsText,
                {
                  color:
                    membership?.membershipType != "Free"
                      ? Colors.black
                      : Colors.grey.countdown,
                },
              ]}
            >
              {/* show high numbers with K/L */}
              {formatNumberWithSuffix(membership?.coins)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: Colors.background, // Matches the status bar color
  },
  header: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 0.25 * StatusBar.currentHeight,
    backgroundColor: Colors.background,
    elevation: 30,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  helloText: {
    marginLeft: 12,
    fontSize: 14,
    maxWidth: width * 0.4,
    fontFamily: "Poppins-Regular",
  },
  username: {
    marginLeft: 12,
    fontSize: 16,
    maxWidth: width * 0.4,
    fontFamily: "Poppins-Regular",
  },
  upgradeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 40,
    borderColor: Colors.upgradeBorder,
    borderWidth: 1,
  },
  upgradeText: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
  credits: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bottomNavigation,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    gap: 5,
  },
  creditsText: {
    marginRight: 5,
    fontWeight: "bold",
    fontSize: 18,
  },
  profileImage: {
    borderRadius: 20,
    borderColor: Colors.black,
    objectFit: "cover",
    borderWidth: 0.1,
  },
  rightWrapper: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Header;
