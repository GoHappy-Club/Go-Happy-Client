import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { hp, wp } from "../helpers/common";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Quotes = () => {
  const [quote, setQuote] = useState({});

  useEffect(() => {
    const getTodaysQuote = async () => {
      const todayQuote = await AsyncStorage.getItem("dailyQuote");
      const parsedQuote = JSON.parse(todayQuote);
      setQuote(parsedQuote);
    };
    getTodaysQuote();
  }, []);

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
          <Text style={styles.quoteHindi}>{quote?.quote?.hindi}</Text>
          <Text style={styles.quoteEnglish}>{quote?.quote?.english}</Text>
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
    // fontFamily: "Beautiful Heart",
    fontFamily: "Montserrat-Regular",
    fontSize: wp(15),
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
