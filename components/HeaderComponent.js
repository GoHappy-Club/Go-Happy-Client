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
} from "react-native";
import { Colors } from "../assets/colors/color";
import { useDispatch, useSelector } from "react-redux";
import GradientText from "../commonComponents/GradientText";
import { useNavigation } from "@react-navigation/native";
import BottomSheet from "./BottomSheet";
import SessionRatingSheet from "./RatingSheet";
import {
  activateFreeTrial,
  checkPendingFeedback,
  deactivateFreeTrial,
  submitRating,
} from "../services/Startup";
import AsyncStorage from "@react-native-async-storage/async-storage";

const width = Dimensions.get("window").width;

const rotateAnim = new Animated.Value(0);

const Header = () => {
  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state?.membership?.membership);

  const [modalType, setModalType] = useState("");
  const [showRating, setShowRating] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  const modalRef = useRef();
  const ratingModalRef = useRef();
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    checkPendingFeedback(setShowRating, setCurrentSession);

    const subscription = AppState.addEventListener("change", nextAppState => {
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
    if (
      membership.membershipType == "Free" &&
      membership?.freeTrialUsed == false
    ) {
      setModalType("FreeTrial");
    } else if (
      membership.membershipType == "Free" &&
      membership?.freeTrialUsed == true &&
      checkFreeTrialExpired(membership)
    ) {
      deactivateFreeTrial();
      setModalType("FreeTrialExpired");
    }
  }, [membership]);

  // TODO : free trial modal
  // useEffect(() => {
  //   if (modalType == "FreeTrial" || modalType == "FreeTrialExpired")
  //     openGeneralModal(modalRef);
  // }, [modalType]);

  // TODO : rating modal
  // useEffect(() => {
  //   checkPendingFeedback(setShowRating, setCurrentSession);
  // }, []);

  // TODO : open the rating modal
  // useEffect(() => {
  //   if (showRating == true) {
  //     ratingModalRef.current?.present();
  //   }
  // }, [showRating, currentSession, ratingModalRef.current]);

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

  return (
    <>
      <BottomSheet
        closeModal={() => closeGeneralModal()}
        modalRef={modalRef}
        type={modalType}
        cta={() => activateFreeTrial(profile)}
      />
      <SessionRatingSheet
        modalRef={ratingModalRef}
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
            0,
            true
          );
          ratingModalRef.current?.dismiss();
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
          {/* <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.helloText}>Hello</Text>
          <Text style={styles.username}>
            {trimContent(profile.name.split(" ")[0])}
          </Text>
        </View> */}
        </Pressable>
        <View style={styles.rightWrapper}>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => navigation.navigate("SubscriptionPlans")}
          >
            <FontAwesomeIcon icon={faCrown} color="#FBC65F" />
            <GradientText
              text="Upgrade"
              style={styles.upgradeText}
              colors={Colors.headerLinearGradient}
            />
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
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 0.25 * StatusBar.currentHeight,
    backgroundColor: Colors.grey.header,
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
    backgroundColor: Colors.grey.lightgrey,
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
