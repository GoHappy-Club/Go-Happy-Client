import {
  BackHandler,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "../../assets/colors/color";
import { hp, wp } from "../../helpers/common";
import { useNavigation, useRoute } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import FastImage from "react-native-fast-image";

const PaymentSuccessful = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [timer, setTimer] = useState(4);

  const timerRef = useRef();
  const timingRef = useRef();

  // type -> normal, empty for subscription
  const { type, navigateTo } = route?.params;

  useEffect(() => {
    const backAction = () => {
      navigation.navigate(navigateTo ? navigateTo : "GoHappy Club");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      navigation.navigate(navigateTo ? navigateTo : "GoHappy Club");
    }, 4000);

    timingRef.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(timingRef.current);
    };
  }, []);

  if (type && type == "normal")
    return (
      <SafeAreaView style={styles.container}>
        <LottieView
          source={require("../../assets/lottie/correct.json")}
          autoPlay
          style={{
            width: wp(100),
            height: hp(30),
          }}
          speed={0.5}
        />
        <FastImage
          source={require("../../images/hurray.png")}
          style={styles.image}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.textWrapper}>
          <Text style={styles.plainText}>
            {t("payment_successful")}
          </Text>
        </View>
        {/* <Pressable
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
            },
            styles.retryButton,
          ]}
          onPress={() =>
            navigation.navigate(navigateTo ? navigateTo : "GoHappy Club")
          }
        >
          <View
            style={{
              flexDirection: "row",
              gap: wp(3),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.retryText}>Explore</Text>
          </View>
        </Pressable> */}
        <Text>{t("redirecting")} {timer}. </Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <LottieView
        source={require("../../assets/lottie/correct.json")}
        autoPlay
        style={{
          width: wp(100),
          height: hp(30),
        }}
        speed={0.5}
      />
      <FastImage
        source={require("../../images/hurray.png")}
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.textWrapper}>
        <Text style={styles.plainText}>
          Congratulations! Your payment was successful, and you're now a member
          of the GoHappy Club.
        </Text>
        <Text style={styles.plainText}>Welcome aboard! 🎉</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
          },
          styles.retryButton,
        ]}
        onPress={() => navigation.navigate("GoHappy Club")}
      >
        <View
          style={{
            flexDirection: "row",
            gap: wp(3),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.retryText}>Explore</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default PaymentSuccessful;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: wp(60),
  },
  textWrapper: {
    marginBottom: wp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: wp(8),
    fontWeight: "bold",
    color: Colors.referPrimary,
    fontFamily: "monospace",
    marginVertical: hp(2),
  },
  plainText: {
    fontSize: wp(4),
    color: Colors.black,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    width: wp(95),
  },
  retryButton: {
    backgroundColor: Colors.pink.sessionDetails,
    padding: 10,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    width: wp(60),
  },
  retryText: {
    fontSize: wp(6),
    fontWeight: "bold",
    color: Colors.primaryText,
    fontFamily: Platform.OS == "android" ? "Droid Sans Mono" : "Avenir",
  },
});
