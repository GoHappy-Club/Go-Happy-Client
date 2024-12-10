import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { hp, wp } from "../helpers/common";

const Quotes = () => {
  return (
    <>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: hp(100),
        }}
      >
        <LottieView
          source={require("../assets/lottie/bg.lottie")}
          autoPlay
          loop
          style={{
            width: wp(100),
            height: hp(100),
            transform: [{ scale: 5.2 }, { rotate: "90deg" }],
            zIndex: -1000,
            position: "absolute",
          }}
        />
        {/* <LottieView
          source={require("../assets/lottie/sp.json")}
          autoPlay
          loop
          style={{
            width: wp(50),
            height: hp(50),
            // transform: [{ scale: 1.2 }],
            zIndex: -100,
            position: "absolute",
          }}
        /> */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteHindi}>जीवन एक यात्रा है</Text>
          <Text style={styles.quoteEnglish}>Life is a journey</Text>
        </View>
      </View>
    </>
  );
};

export default Quotes;

const styles = StyleSheet.create({
  quoteContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  quoteHindi: {
    fontFamily: "Tillana-Regular",
    fontSize: wp(15),
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 1,
  },
  quoteEnglish: {
    fontFamily: "Beautiful Heart",
    fontSize: wp(15),
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
