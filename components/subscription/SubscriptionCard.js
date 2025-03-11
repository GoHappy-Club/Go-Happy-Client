import { BlurView } from "@react-native-community/blur";
import { format, fromUnixTime } from "date-fns";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";

import { Colors } from "../../assets/colors/color";
import { hp, wp } from "../../helpers/common";
import DarkWordLogo from "../../images/darkWordLogo.png";
import WordLogo from "../../images/wordLogo.png";
const COLORS_MAPPING = {
  Silver: {
    gradient: ["#C0C0C0", "#E8E8E8", "#B8B8B8"],
    textColor: Colors.black,
    logo: DarkWordLogo,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    borderColor: Colors.grey.f0,
  },
  Gold: {
    gradient: ["#FFD700", "#FDB931", "#A85F05"],
    textColor: Colors.black,
    logo: WordLogo,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    borderColor: "#FF8C00",
  },
  Platinum: {
    gradient: ["#304352", "#304352A1", "#d7d2cc", "#304352A1"],
    textColor: Colors.white,
    logo: DarkWordLogo,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    borderColor: Colors.grey.f0,
  },
};

const SubscriptionCard = () => {
  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state.membership.membership);

  const [showBlur, setShowBlur] = useState(true);

  useEffect(() => {
    return () => {
      setShowBlur(false);
    };
  }, []);
  const loadDate = (time) => {
    return format(fromUnixTime(time / 1000), "MM/yy");
  };

  if (membership?.membershipType == "Free") {
    return (
      <>
        <LinearGradient
          colors={COLORS_MAPPING["Silver"]["gradient"]}
          style={[
            styles.card,
            {
              borderColor: COLORS_MAPPING["Silver"]["borderColor"],
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.nameContainer}>
            <View
              style={{
                flexDirection: "column",
                gap: 0,
              }}
            >
              <Text
                style={[
                  styles.name,
                  {
                    color: COLORS_MAPPING["Silver"]["textColor"],
                    textShadowColor:
                      COLORS_MAPPING["Silver"]["textShadowColor"],
                  },
                ]}
              >
                {profile.name}
              </Text>
              <Text
                style={[
                  styles.expiry,
                  {
                    color: COLORS_MAPPING["Silver"]["textColor"],
                    textShadowColor:
                      COLORS_MAPPING["Silver"]["textShadowColor"],
                  },
                ]}
              >
                {loadDate(membership.membershipEndDate)}
              </Text>
            </View>
          </View>
          <FastImage
            source={COLORS_MAPPING["Silver"]["logo"]}
            style={{
              width: wp(20),
              height: wp(8),
              position: "absolute",
              top: 5,
              right: 5,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text
            style={[
              styles.membershipType,
              {
                color: COLORS_MAPPING["Silver"]["textColor"],
                textShadowColor: COLORS_MAPPING["Silver"]["textShadowColor"],
              },
            ]}
          >
            {membership.membershipType}
          </Text>
          <Text
            style={[
              styles.membershipText,
              {
                color: COLORS_MAPPING["Silver"]["textColor"],
                textShadowColor: COLORS_MAPPING["Silver"]["textShadowColor"],
              },
            ]}
          >
            Membership
          </Text>
          <FastImage
            style={styles.cover}
            resizeMode="cover"
            source={{
              uri: profile.profileImage,
            }}
          />
        </LinearGradient>
        {showBlur && (
          <BlurView
            blurAmount={8}
            blurType="light"
            style={{
              position: "absolute",
              width: wp(100),
              height: hp(23),
              borderRadius: 10,
              overflow: Platform.OS === "android" ? "hidden" : "visible",
            }}
            overlayColor="transparent"
          />
        )}
      </>
    );
  }

  return (
    <LinearGradient
      colors={COLORS_MAPPING[membership?.membershipType]["gradient"]}
      style={[
        styles.card,
        {
          borderColor:
            COLORS_MAPPING[membership?.membershipType]["borderColor"],
        },
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {membership.freeTrialActive && (
        <Text
          style={[
            styles.watermark,
            {
              color: COLORS_MAPPING[membership?.membershipType]["textColor"],
            },
          ]}
        >
          FREE TRIAL
        </Text>
      )}

      <View style={styles.nameContainer}>
        <View
          style={{
            flexDirection: "column",
            gap: 0,
          }}
        >
          <Text
            style={[
              styles.name,
              {
                color: COLORS_MAPPING[membership?.membershipType]["textColor"],
                textShadowColor:
                  COLORS_MAPPING[membership?.membershipType]["textShadowColor"],
              },
            ]}
          >
            {profile.name}
          </Text>
          <Text
            style={[
              styles.expiry,
              {
                color: COLORS_MAPPING[membership?.membershipType]["textColor"],
                textShadowColor:
                  COLORS_MAPPING[membership?.membershipType]["textShadowColor"],
              },
            ]}
          >
            {loadDate(membership.membershipEndDate)}
          </Text>
        </View>
      </View>
      <FastImage
        source={COLORS_MAPPING[membership?.membershipType]["logo"]}
        style={{
          width: wp(20),
          height: wp(8),
          position: "absolute",
          top: 5,
          right: 5,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Text
        style={[
          styles.membershipType,
          {
            color: COLORS_MAPPING[membership?.membershipType]["textColor"],
            textShadowColor:
              COLORS_MAPPING[membership?.membershipType]["textShadowColor"],
          },
        ]}
      >
        {membership.membershipType}
      </Text>
      <Text
        style={[
          styles.membershipText,
          {
            color: COLORS_MAPPING[membership?.membershipType]["textColor"],
            textShadowColor:
              COLORS_MAPPING[membership?.membershipType]["textShadowColor"],
          },
        ]}
      >
        Membership
      </Text>
      <FastImage
        style={styles.cover}
        resizeMode="cover"
        source={{
          uri: profile.profileImage,
        }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: hp(23),
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  nameContainer: {
    flexDirection: "column",
    gap: 10,
    position: "absolute",
    bottom: 2,
    left: 15,
  },
  name: {
    fontSize: 18,
    fontFamily: "Poppins-Light",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textTransform: "capitalize",
  },
  cover: {
    width: wp(10),
    height: wp(10),
    borderRadius: 20,
    position: "absolute",
    bottom: 5,
    right: 10,
  },
  expiry: {
    fontSize: 16,
    fontFamily: "Poppins-Light",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  membershipType: {
    fontSize: 30,
    fontFamily: "Poppins-ExtraLight",
    position: "absolute",
    left: 10,
    textTransform: "uppercase",
  },
  membershipText: {
    position: "absolute",
    left: 10,
    top: 32,
    textTransform: "uppercase",
    fontSize: 12,
    fontFamily: "Poppins-Light",
    marginLeft: wp(0.5),
    color: "white",
  },
  watermark: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    fontSize: wp(10),
    fontFamily: "Poppins-Regular",
    opacity: 0.2,
    // transform: [{ rotate: "-20deg" }],
    alignSelf: "center",
    top: "35%",
    textTransform: "uppercase",
    letterSpacing: 4,
  },
});

export default SubscriptionCard;
