import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Alert,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import { hp, wp } from "../../helpers/common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "react-native-linear-gradient";
import ViewShot, { captureRef } from "react-native-view-shot";
import { Button } from "react-native-elements";
import RNFS from "react-native-fs";
import { Colors } from "../../assets/colors/color";
import FastImage from "react-native-fast-image";
import Share from "react-native-share";
import { Share2 } from "lucide-react-native";
import { useSelector } from "react-redux";
import firebase from "@react-native-firebase/app";
import toUnicodeVariant from "../toUnicodeVariant";
import { FirebaseDynamicLinksProps } from "../../config/CONSTANTS";

const Quotes = () => {
  const [quote, setQuote] = useState({});
  const [showUserData, setShowUserData] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const viewShotRef = useRef(null);
  const profile = useSelector((state) => state.profile.profile);

  useEffect(() => {
    const getTodaysQuote = async () => {
      const todayQuote = await AsyncStorage.getItem("dailyQuote");
      const parsedQuote = JSON.parse(todayQuote);
      setQuote(parsedQuote);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    };
    getTodaysQuote();
  }, []);

  const generateReferralLink = async () => {
    const selfInviteCode = profile.selfInviteCode;
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
    return link1;
  };

  const shareQuoteOnWhatsApp = async () => {
    setShowUserData(true);
    try {
      const base64Data = await captureRef(viewShotRef, {
        format: "png",
        quality: 0.9,
        result: "base64",
      });
      setShowUserData(false);
      const filePath = `${
        RNFS.TemporaryDirectoryPath
      }/${new Date().getTime()}_daily_quote.png`;
      const referralLink = await generateReferralLink();

      await RNFS.writeFile(filePath, base64Data, "base64");
      await Share.open({
        title: "Daily Quote",
        message:
          "Check out today's quote!\n\n " +
          "Come and join my happy family, " +
          toUnicodeVariant("GoHappy Club", "italic") +
          " and attend " +
          toUnicodeVariant("Free sessions", "bold") +
          " on " +
          toUnicodeVariant("Fitness, Learning and Fun", "bold") +
          ", carefully designed for the 50+ with a dedicated team to treat you with uttermost love and respect. \n\n" +
          toUnicodeVariant("Click on the link below ", "bold italic") +
          "(नीचे दिए गए लिंक पर क्लिक करें ) to install the application using my referral link and attend FREE sessions: " +
          referralLink,
        url: `file://${filePath}`,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setShowUserData(false);
    }
  };

  return (
    <>
      <StatusBar barStyle={"light-content"} backgroundColor={"#4A1259"} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient
          colors={["#4A1259", "#2D0F45", "#1A0B2E"]}
          style={styles.container}
        >
          <ViewShot
            ref={viewShotRef}
            options={{ format: "png", quality: 0.9 }}
            style={styles.quoteContainer}
          >
            <View
              style={[
                styles.userInfo,
                {
                  display: showUserData ? "flex" : "none",
                },
              ]}
            >
              <Image
                source={{ uri: profile.profileImage }}
                style={[styles.userPhoto]}
              />
              <Text style={styles.userName}>{profile.name}</Text>
            </View>
            <Animated.View
              style={[
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
                {
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <View style={styles.decorativeLine} />
              <AnimatedText
                text={quote?.quote?.hindi}
                style={styles.quoteHindi}
                duration={300}
              />
              <View style={styles.separator} />
              <AnimatedText
                text={quote?.quote?.english}
                style={styles.quoteEnglish}
                duration={300}
              />
              <View style={styles.decorativeLine} />
            </Animated.View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
                position: "absolute",
                bottom: 10,
                right: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: wp(3),
                  color: Colors.white,
                }}
              >
                Powered by
              </Text>
              <FastImage
                source={require("../../images/wordLogo.png")}
                style={{
                  width: wp(20),
                  height: wp(8),
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </ViewShot>
          <Button
            title={ButtonTitle}
            onPress={shareQuoteOnWhatsApp}
            buttonStyle={styles.shareButton}
            titleStyle={{
              color: Colors.black,
            }}
          />
        </LinearGradient>
      </ScrollView>
    </>
  );
};

const ButtonTitle = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Text
        style={{
          fontFamily: "Montserrat-Regular",
          fontSize: wp(4),
          color: Colors.black,
        }}
      >
        Share with friends
      </Text>
      <Share2 color={Colors.black} size={24} />
    </View>
  );
};

const AnimatedText = ({ text, style, duration }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const determineFontSize = (text) => {
    const textLength = text?.length || 0;

    if (textLength <= 50) {
      return wp(12);
    } else if (textLength <= 100) {
      return wp(8);
    } else {
      return wp(6);
    }
  };

  const adjustedFontSize = determineFontSize(text);

  useEffect(() => {
    if (currentIndex < text?.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, duration / text.length);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, duration]);

  return (
    <Text style={[style, { fontSize: adjustedFontSize }]}>{displayedText}</Text>
  );
};

export default Quotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: StatusBar.currentHeight,
    paddingBottom: StatusBar.currentHeight * 2.5,
  },
  quoteContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    backgroundColor: "#4A125991",
    borderRadius: 20,
    padding: wp(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    minHeight: "auto",
  },
  decorativeLine: {
    width: wp(20),
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: hp(2),
  },
  separator: {
    width: wp(15),
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: hp(3),
  },
  quoteHindi: {
    fontFamily: "Tillana-Regular",
    fontSize: wp(12),
    color: Colors.white,
    textAlign: "center",
    marginBottom: hp(1),
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  quoteEnglish: {
    fontFamily: "Montserrat-Regular",
    fontSize: wp(10),
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    letterSpacing: 0.8,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  shareButton: {
    marginTop: 20,
    backgroundColor: Colors.grey.f0,
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.5),
    borderRadius: 5,
    color: Colors.black,
  },
  userInfo: {
    // position: "absolute",
    // top: 25,
    // left: 25,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  userPhoto: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    marginRight: 10,
  },
  userName: {
    fontFamily: "Montserrat-Regular",
    fontSize: wp(4),
    color: Colors.white,
  },
});
