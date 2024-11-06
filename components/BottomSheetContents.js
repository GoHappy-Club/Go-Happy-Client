import { Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../assets/colors/color";
import TypeWriterEffect from "react-native-typewriter-effect";

const AnimatedText = () => {
  const messages = [
    "Join our club for free",
    "Stay connected",
    "Enjoy discounts",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <View style={{ marginVertical: 20 }}>
      <TypeWriterEffect
        content={messages[currentMessageIndex]}
        maxDelay={60}
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: Colors.black,
          textAlign: "center",
        }}
      />
    </View>
  );
};
export const FreeTrialContent = ({ cta }) => (
  <>
    <AnimatedText />
    <View
      style={{
        gap: -10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: Colors.referLinkBackground,
          paddingVertical: 16,
          borderRadius: 25,
          alignItems: "center",
          marginBottom: 10,
          width: "95%",
        }}
        onPress={cta}
      >
        <Text style={{ color: Colors.black, fontSize: 20, fontWeight: "bold" }}>
          Start Free Trial
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 14,
          color: Colors.white,
          textAlign: "center",
          marginTop: 5,
        }}
      >
        No credit card needed • Cancel anytime
      </Text>
    </View>
  </>
);

export const FreeTrialExpiredContent = () => (
  <>
    <View
      style={{
        gap: -10,
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: Colors.referLinkBackground,
          paddingVertical: 16,
          borderRadius: 25,
          alignItems: "center",
          marginBottom: 10,
        }}
        onPress={() => {
          // Implement your trial activation logic
          // console.log("Free trial activated!");
        }}
      >
        <Text style={{ color: Colors.black, fontSize: 20, fontWeight: "bold" }}>
          Free Trial Expired, buy subs
        </Text>
      </TouchableOpacity>
    </View>
  </>
);
