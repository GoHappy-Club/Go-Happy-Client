import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Colors } from "../assets/colors/color";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const CountdownTimer = ({
  targetTime,
  width = 40,
  height = 40,
  separatorSize = 30,
  textSize = 14,
  showText,
}) => {
  const calculateTimeLeft = () => {
    const difference = targetTime - Date.now();
    let timeLeft = {};

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      timeLeft = {
        days,
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  if (timeLeft.days > 0) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: Colors.grey.countdown,
            padding: 8,
            borderRadius: 5,
            height: showText && "100%",
          },
        ]}
      >
        <Text style={[styles.dayText, { fontSize: textSize + 2 }]}>
          {showText && "Starting in "}
          {timeLeft.days} day{timeLeft.days > 1 ? "s" : ""}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.timeBox, { width: width, height: height }]}>
        <Text style={[styles.timeText, { fontSize: textSize }]}>
          {timeLeft.hours || "00"}
        </Text>
      </View>
      <Text style={[styles.colon, { fontSize: separatorSize }]}>:</Text>
      <View style={[styles.timeBox, { width: width, height: height }]}>
        <Text style={[styles.timeText, { fontSize: textSize }]}>
          {timeLeft.minutes || "00"}
        </Text>
      </View>
      <Text style={[styles.colon, { fontSize: separatorSize }]}>:</Text>
      <View style={[styles.timeBox, { width: width, height: height }]}>
        <Text style={[styles.timeText, { fontSize: textSize }]}>
          {timeLeft.seconds || "00"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  timeBox: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: Colors.grey.countdown,
    marginHorizontal: 1,
    textAlign: "center",
  },
  timeText: {
    fontWeight: "bold",
    color: Colors.white,
  },
  colon: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.grey.countdown,
    marginHorizontal: 2,
  },
  dayText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
  },
});

export default CountdownTimer;
