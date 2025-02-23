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
  Platform,
} from "react-native";
import { Colors } from "../assets/colors/color";
import { useDispatch, useSelector } from "react-redux";
import GradientText from "../commonComponents/GradientText";
import { useNavigation } from "@react-navigation/native";
import BottomSheet from "./CustomBottomSheet/BottomSheet";
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
import quotes from "../constants/quotes.json";
import {
  ScheduledNotifcation,
  scheduleMedicineReminders,
  scheduleWaterReminders,
} from "../services/LocalPushController";
import { hp, wp } from "../helpers/common";
import SessionRatingAlert from "./CustomBottomSheet/RatingSheet";

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
  const [loading, setLoading] = useState(false);
  const [freeTrialActivated, setFreeTrialActivated] = useState(false);

  const modalRef = useRef();
  const ratingModalRef = useRef();
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const getRandomQuote = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayString = today.toISOString().split("T")[0];

        const storedQuoteData = await AsyncStorage.getItem("dailyQuote");
        let parsedData = null;

        if (storedQuoteData) {
          try {
            parsedData = JSON.parse(storedQuoteData);
          } catch (e) {
            console.error("Error parsing stored quote:", e);
          }
        }

        if (
          !parsedData ||
          !parsedData.date ||
          !parsedData.quote ||
          parsedData.date !== todayString ||
          !parsedData.quote.english
        ) {
          if (!quotes?.quotes?.length) {
            throw new Error("Quotes data is not properly loaded");
          }

          const randomIndex = Math.floor(Math.random() * quotes.quotes.length);
          const randomQuote = quotes.quotes[randomIndex];

          if (!randomQuote?.english) {
            throw new Error("Invalid quote structure");
          }

          parsedData = {
            date: todayString,
            quote: randomQuote,
          };

          await AsyncStorage.setItem("dailyQuote", JSON.stringify(parsedData));

          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(7, 0, 0, 0);

          await ScheduledNotifcation(
            "Your Daily Motivation",
            randomQuote.english,
            tomorrow
          );
        }
        return parsedData;
      } catch (error) {
        console.error("Error in getRandomQuote:", error);
        return {
          date: new Date().toISOString().split("T")[0],
          quote: {
            hindi: "कड़ी मेहनत करते रहें।",
            english: "Keep working hard.",
          },
        };
      }
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
      <SessionRatingAlert
        showAlert={showRating}
        loading={loading}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        reason={reason}
        setReason={setReason}
        submitted={submitted}
        setSubmitted={setSubmitted}
        currentSession={currentSession}
        closeAlert={() => {
          submitRating(
            currentSession,
            setCurrentSession,
            setShowRating,
            0,
            false
          );
          setShowRating(false);
        }}
        submitRating={() => {
          submitRating(
            currentSession,
            setCurrentSession,
            setShowRating,
            selectedRating,
            true,
            profile.phoneNumber,
            reason,
            setSubmitted,
            setLoading
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
        {/* <View style={styles.rightWrapper}>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => navigation.navigate("SubscriptionPlans")}
          >
            <FontAwesomeIcon icon={faCrown} color="#FBC65F" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.credits}
            onPress={() => navigation.navigate("WalletScreen")}
          >
            <Animated.Image
              source={require("../images/coins.png")}
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
              {formatNumberWithSuffix(membership?.coins)}
            </Text>
          </TouchableOpacity>
        </View> */}
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
    paddingVertical:
      Platform.OS === "android" ? 0.25 * StatusBar.currentHeight : wp(1),
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
