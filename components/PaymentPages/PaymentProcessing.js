import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { Colors } from "../../assets/colors/color";
import { wp } from "../../helpers/common";
import { verifyPayment } from "../../helpers/VerifyPayment";

const TIMER_DURATION = 60;
const CIRCLE_RADIUS = 45;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PaymentProcessing = () => {
  const strokeDashoffset = useSharedValue(0);
  const [countdown, setCountdown] = useState(TIMER_DURATION);
  const route = useRoute();
  const { callback, error_handler, order_id } = route.params;
  const navigation = useNavigation();

  const timingRef = useRef();

  const handlePending = () => {
    navigation.navigate("PaymentFailed", {
      navigateTo: "GoHappy Club",
      type: "pending",
    });
  };

  useEffect(() => {
    const verify = async () => {
      const response = await verifyPayment(order_id);
      if (response?.status === "success") {
        callback?.();
      } else if (response?.status === "pending") {
        handlePending();
      } else {
        error_handler?.();
      }
    };
    verify();
  }, []);

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => handler.remove();
  }, []);

  useEffect(() => {
    timingRef.current = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    if (countdown <= 0) {
      handlePending();
      clearInterval(timingRef.current);
    }

    strokeDashoffset.value = withTiming(CIRCLE_CIRCUMFERENCE, {
      duration: TIMER_DURATION * 1000,
      easing: Easing.linear,
    });

    return () => {
      clearInterval(timingRef.current);
    };
  }, [strokeDashoffset, countdown]);

  const circleAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeDashoffset.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Svg
          width="200"
          height="200"
          viewBox="0 0 100 100"
          style={{ transform: [{ rotate: "-90deg" }] }}
        >
          <Circle
            cx="50"
            cy="50"
            r={CIRCLE_RADIUS}
            stroke={Colors.grey.e}
            strokeWidth="8"
            fill="none"
          />
          <AnimatedCircle
            cx="50"
            cy="50"
            r={CIRCLE_RADIUS}
            stroke={Colors.primary}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${CIRCLE_CIRCUMFERENCE}`}
            animatedProps={circleAnimatedProps}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={styles.timerText}>{countdown}</Text>
      </View>
      <Text style={styles.message}>
        We are processing your payment, please don&apos;t press back and hang
        tight.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 20,
  },
  timerContainer: {
    position: "relative",
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    position: "absolute",
    fontSize: 48,
    fontWeight: "500",
    color: Colors.primary,
  },
  message: {
    marginTop: 30,
    fontSize: wp(4),
    textAlign: "center",
    color: "#333333",
    lineHeight: 24,
    fontFamily: "Montserrat-SemiBold",
    width: wp(95),
  },
});

export default PaymentProcessing;
