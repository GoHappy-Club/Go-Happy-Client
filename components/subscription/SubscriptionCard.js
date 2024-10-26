import { Crown } from "lucide-react-native";
import React from "react";
import { Image, Platform } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";
import { hp, wp } from "../../helpers/common";
import { format, fromUnixTime } from "date-fns";
import { BlurView } from "@react-native-community/blur";
import { Colors } from "../../assets/colors/color";

const COLORS_MAPPING = {
  Silver: {
    gradient: ["#C0C0C0", "#E8E8E8", "#B8B8B8"],
    textColor: Colors.black,
    logo: require("../../images/darkWordLogo.png"),
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    borderColor: Colors.grey.f0,
  },
  Gold: {
    gradient: ["#FFD700", "#FDB931", "#A85F05"],
    textColor: Colors.black,
    logo: require("../../images/wordLogo.png"),
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    borderColor: "#FF8C00",
  },
  Platinum: {
    gradient: ["#304352", "#304352A1", "#d7d2cc", "#304352A1"],
    textColor: Colors.white,
    logo: require("../../images/darkWordLogo.png"),
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    borderColor: Colors.grey.f0,
  },
};

const SubscriptionCard = () => {
  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state.membership.membership);

  const loadDate = (time) => {
    return format(fromUnixTime(time/1000), "MM/yy");
  };

  if (membership?.membershipType == "Free") {
    return (
      <>
        <LinearGradient
          colors={["#ff9a9e", "#fad0c4"]}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.nameContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Image
                style={styles.cover}
                resizeMode="cover"
                source={{
                  uri: profile.profileImage,
                }}
              />
              <Text style={styles.name}>{profile.name}</Text>
              <Crown size={24} color={"#FFD700"} fill={"#FFD700"} />
            </View>
            <Text style={styles.phoneNumber}>
              XXXXX{profile?.phoneNumber?.substring(7, 12)}
            </Text>
          </View>
          <View
            style={{
              position: "absolute",
              right: 20,
              top: 10,
            }}
          >
            <Image
              source={require("../../images/logo.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text style={styles.identifier}>GoHappy Club</Text>
          </View>
          <Text style={styles.membershipType}>{membership.membershipType}</Text>
          <BlurView
          blurAmount={8}
          blurType="light"
          style={{
            position: "fixed",
            top: "-20%",
            left: "-20%",
            // bottom: 0,
            // right: 0,
            width:wp(150),
            height: hp(23),
          }}
        />
        </LinearGradient>
      </>
    );
  }

  return (
    <LinearGradient
      colors={COLORS_MAPPING[membership?.membershipType]["gradient"]}
      style={[
        styles.card,
        {
          borderColor: COLORS_MAPPING[membership?.membershipType]["borderColor"],
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
      <Image
        source={COLORS_MAPPING[membership?.membershipType]["logo"]}
        style={{
          width: wp(20),
          height: wp(8),
          position: "absolute",
          resizeMode: "contain",
          top: 5,
          right: 5,
        }}
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
      <Image
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
    width: wp(70),
    height: hp(20),
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
});

export default SubscriptionCard;
