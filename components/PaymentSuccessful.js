import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "../assets/colors/color";
import { hp, wp } from "../helpers/common";
import { useNavigation, useRoute } from "@react-navigation/native";

const PaymentSuccessful = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [timer, setTimer] = useState(8);

  const timerRef = useRef();
  const timingRef = useRef();

  // type -> normal, empty for subscription
  const { type, navigateTo } = route?.params;

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      navigation.navigate(navigateTo ? navigateTo : "GoHappy Club");
    }, 3000);

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
      <View style={styles.container}>
        <LottieView
          source={require("../assets/lottie/correct.lottie")}
          autoPlay
          loop
          style={{
            width: wp(100),
            height: hp(30),
            // transform: [{ scale: 5.2 }, { rotate: "90deg" }],
            zIndex: 1000,
            position: "absolute",
          }}
          speed={0.5}
        />
        <FastImage
          source={require("../images/hurray.png")}
          style={styles.image}
        />
        <View style={styles.textWrapper}>
          <Text style={styles.plainText}>
            Congratulations! Your payment was successful.
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
        <Text>Redirecting you in {timer}. If not redirected please </Text>
        <Text
          style={{
            color: "blue",
            textDecorationStyle: "solid",
            textDecorationLine: "underline",
          }}
        >
          Click here
        </Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/lottie/correct.lottie")}
        autoPlay
        loop
        style={{
          width: wp(100),
          height: hp(30),
          // transform: [{ scale: 5.2 }, { rotate: "90deg" }],
          zIndex: 1000,
          position: "absolute",
        }}
        speed={0.5}
      />
      <FastImage
        source={require("../images/hurray.png")}
        style={styles.image}
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
    </View>
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
    width: wp(80),
    resizeMode: "contain",
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
    color: Colors.white,
    fontFamily: Platform.OS == "android" ? "Droid Sans Mono" : "Avenir",
  },
});
