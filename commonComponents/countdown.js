import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const CountdownTimer = ({
  targetTime,
  width=40,
  height=40,
  separatorSize=30,
  textSize=26,
}) => {
  const calculateTimeLeft = () => {
    const difference = targetTime - Date.now();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor(difference / (1000 * 60 * 60)).toString().padStart(2,"0"),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2,"0"),
        seconds: Math.floor((difference % (1000 * 60)) / 1000).toString().padStart(2,"0"),
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

  return (
    <View style={styles.container}>
      <View style={[styles.timeBox, { width: width, height: height }]}>
        <Text style={[styles.timeText,{fontSize:textSize}]}>{timeLeft.hours || 0}</Text>
      </View>
      <Text style={[styles.colon,{fontSize: separatorSize}]}>:</Text>
      <View style={[styles.timeBox, { width: width, height: height }]}>
        <Text style={[styles.timeText,{fontSize:textSize}]}>{timeLeft.minutes || 0}</Text>
      </View>
      <Text style={[styles.colon,{fontSize: separatorSize}]}>:</Text>
      <View style={[styles.timeBox, { width: width, height: height }]}>
        <Text style={[styles.timeText,{fontSize:textSize}]}>{timeLeft.seconds || 0}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
  timeBox: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#29BFC2",
    margin: 5,
    textAlign:"center"
  },
  timeText: {
    fontWeight: "bold",
    color: "#FFF",
  },
  colon: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#29BFC2",
    marginHorizontal: 5,
  },
});

export default CountdownTimer;
