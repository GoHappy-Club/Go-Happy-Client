import React, { useEffect } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { Button } from "react-native-elements";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Colors } from "../assets/colors/color";

const Fallback = ({ resetError }) => {
  const bounceAnimation = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const bounceInterpolation = bounceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          { transform: [{ translateY: bounceInterpolation }] },
        ]}
      >
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          size={80}
          style={styles.icon}
        />
      </Animated.View>
      <Text style={styles.errorText}>Oops! Something went wrong</Text>
      <Text style={styles.subtext}>
        We apologize for the inconvenience. We'll fix this soon. Please try again.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          buttonStyle={styles.button}
          title="Try Again"
          onPress={resetError}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  icon: {
    color: Colors.black,
  },
  errorText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#343a40",
  },
  subtext: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#6c757d",
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: "#38434D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
});

export default Fallback;
